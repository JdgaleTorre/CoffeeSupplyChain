import React, { useEffect, useState } from "react";
import SupplyChainContract from "./contracts/SupplyChain.json";
import getWeb3 from "./getWeb3";
import "bulma/css/bulma.min.css";

import "./App.css";

const initialState = {
  web3: null,
  accounts: null,
  contract: null,
  form: null,
  networkId: null,
  result: null,
};

const App = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const getWeb3Await = async () => {
      const web3 = await getWeb3();
      setState((prevState) => ({
        ...prevState,
        web3,
      }));
    };

    const getAccountAwait = async (web3) => {
      const accounts = await web3.eth.getAccounts();
      setState((prevState) => ({
        ...prevState,
        accounts,
      }));
    };

    const getNetworksAwait = async (web3) => {
      const networkId = await web3.eth.net.getId();
      setState((prevState) => ({
        ...prevState,
        networkId,
      }));
    };

    if (state.web3 === null) {
      try {
        // Get network provider and web3 instance.
        getWeb3Await();
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    }

    if (
      state.web3 !== undefined &&
      state.web3 !== null &&
      state.accounts === null
    ) {
      // Use web3 to get the user's accounts.
      getAccountAwait(state.web3);
    }

    if (
      state.web3 !== null &&
      state.accounts !== null &&
      state.networkId === null
    ) {
      // Get the contract instance.
      getNetworksAwait(state.web3);
    }

    if (
      state.networkId !== null &&
      state.accounts !== null &&
      state.contract === null &&
      state.form === null
    ) {
      const deployedNetwork = SupplyChainContract.networks[state.networkId];
      const instance = new state.web3.eth.Contract(
        SupplyChainContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Declare values of the form
      const form = {
        sku: 1,
        upc: 1,
        ownerID: null,
        originFarmerID: null,
        originFarmName: "Jose Gale",
        originFarmInformation: "Yarra Valley",
        originFarmLatitude: -38.23977,
        originFarmLongitude: 144.34149,
        productNotes: "Best beans for Espresso",
        productPrice: 1,
        distributorID: null,
        retailerID: null,
        consumerID: null,
      };

      setState((prevState) => ({
        ...prevState,
        contract: instance,
        form,
      }));
    }
  }, [state, setState]);

  const FetchDataOne = async () => {
    const address = await getMetaskAccountID();
    console.log(address);
    const result = await state.contract.methods
      .fetchItemBufferOne(state.form.upc)
      .call({ from: address });

    setState((prevState) => ({ ...prevState, result }));
  };

  const FetchDataTwo = async () => {
    const address = await getMetaskAccountID();
    const result = await state.contract.methods
      .fetchItemBufferTwo(state.form.upc)
      .call({ from: address });

    setState((prevState) => ({ ...prevState, result }));
  };

  const onChange = (event) => {
    const {
      target: { name, type, value },
    } = event;

    let newValue = null;
    switch (type) {
      case "number":
        newValue = parseInt(value, 10);
        break;
      default:
        newValue = value;
        break;
    }
    const form = { ...state.form, [name]: newValue };
    setState((prevState) => ({ ...prevState, form }));
  };

  const productOverview = () => {
    return (
      <>
        <div className="container mt-2">
          <section className="section has-background-primary-light">
            <div className="hero">
              <div className="title">
                <h2>Product Overview</h2>
              </div>
              <div className="body">
                <div className="form-group">
                  SKU
                  <br />
                  <input
                    className="input-field"
                    type="number"
                    id="sku"
                    name="sku"
                    value={state.form.sku}
                    onChange={onChange}
                  />
                  <br />
                  UPC
                  <br />
                  <input
                    type="number"
                    id="upc"
                    name="upc"
                    value={state.form.upc}
                    onChange={onChange}
                  />
                  <br />
                  Current Owner ID
                  <br />
                  {state.form.ownerID}
                  <br />
                  <div className="button-div">
                    <button
                      className="button mr-5"
                      id="button"
                      type="button"
                      onClick={FetchDataOne}
                    >
                      Fetch Data 1
                    </button>
                    <button
                      className="button"
                      id="button"
                      type="button"
                      onClick={FetchDataTwo}
                    >
                      Fetch Data 2
                    </button>
                  </div>
                  <div>
                    <h3>Result</h3>
                    <pre>
                      <code>{JSON.stringify(state.result, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  };

  const Harvest = async () => {
    const result = await state.contract.methods
      .harvestItem(
        state.form.upc,
        state.form.originFarmerID,
        state.form.originFarmName,
        state.form.originFarmInformation,
        state.form.originFarmLatitude.toString(),
        state.form.originFarmLongitude.toString(),
        state.form.productNotes
      )
      .send({ from: state.form.originFarmerID });
    console.log(result);
  };

  const Process = async () => {
    const result = await state.contract.methods
      .processItem(state.form.upc)
      .send({ from: state.form.originFarmerID });
    console.log(result);
  };

  const Pack = async () => {
    const result = await state.contract.methods
      .packItem(state.form.upc)
      .send({ from: state.form.originFarmerID });
    console.log(result);
  };

  const ForSale = async () => {
    const result = await state.contract.methods
      .sellItem(state.form.upc, state.form.productPrice)
      .send({ from: state.form.originFarmerID });
    console.log(result);
  };

  const BuyItem = async () => {
    const result = await state.contract.methods.buyItem(state.form.upc).send({
      from: state.form.distributorID,
      value: state.web3.utils.toWei(state.form.productPrice.toString()),
    });
    console.log(result);
  };

  const ShipItem = async () => {
    const result = await state.contract.methods
      .shipItem(state.form.upc)
      .send({ from: state.form.originFarmerID });
    console.log(result);
  };

  const ReceiveItem = async () => {
    const result = await state.contract.methods
      .receiveItem(state.form.upc)
      .send({ from: state.form.retailerID });
    console.log(result);
  };

  const PurchaseItem = async () => {
    const result = await state.contract.methods
      .purchaseItem(state.form.upc)
      .send({ from: state.form.consumerID });
    console.log(result);
  };

  const farmDetails = () => {
    return (
      <>
        <div className="container">
          <section className="section has-background-link-light">
            <div className="hero">
              <div className="title">
                <h2>Farm Details</h2>
              </div>
              <div className="body">
                <div className="form-group">
                  Farmer ID
                  <br />
                  {state.form.originFarmerID}
                  <br />
                  Farm Name
                  <br />
                  <input
                    type="text"
                    id="originFarmName"
                    name="originFarmName"
                    onChange={onChange}
                    value={state.form.originFarmName}
                  />
                  <br />
                  Farm Information
                  <br />
                  <input
                    type="text"
                    id="originFarmInformation"
                    name="originFarmInformation"
                    onChange={onChange}
                    value={state.form.originFarmInformation}
                  />
                  <br />
                  Farm Latitude
                  <br />
                  <input
                    type="text"
                    id="originFarmLatitude"
                    name="originFarmLatitude"
                    onChange={onChange}
                    value={state.form.originFarmLatitude}
                  />
                  <br />
                  Farm Longitude
                  <br />
                  <input
                    type="text"
                    id="originFarmLongitude"
                    name="originFarmLongitude"
                    onChange={onChange}
                    value={state.form.originFarmLongitude}
                  />
                  <br />
                  <br />
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="1"
                    onClick={Harvest}
                    disabled={state.form.originFarmerID === null}
                  >
                    Harvest
                  </button>
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="2"
                    onClick={Process}
                    disabled={state.form.originFarmerID === null}
                  >
                    Process
                  </button>
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="3"
                    onClick={Pack}
                    disabled={state.form.originFarmerID === null}
                  >
                    Pack
                  </button>
                  <button
                    className="button"
                    id="button"
                    type="button"
                    data-id="4"
                    onClick={ForSale}
                    disabled={state.form.originFarmerID === null}
                  >
                    ForSale
                  </button>
                  {state.form.originFarmerID === null && (
                    <div class="notification has-background-danger-light mt-2">
                      First you have to Add a Farmer
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  };

  const getMetaskAccountID = async () => {
    const accounts = await state.web3.eth.getAccounts();
    return accounts[0];
  };

  const AddFarmer = async () => {
    const address = await getMetaskAccountID();
    const isFarmer = await state.contract.methods
      .isFarmer(address)
      .call({ from: address });

    if (!isFarmer) {
      await state.contract.methods.addFarmer(address);
    }
    const form = { ...state.form, originFarmerID: address };
    setState((prevState) => ({ ...prevState, form }));
  };

  const AddDistributor = async () => {
    const address = await getMetaskAccountID();
    const isDistributor = await state.contract.methods
      .isDistributor(address)
      .call({ from: address });

    if (!isDistributor) {
      await state.contract.methods
        .addDistributor(address)
        .send({ from: address });
    }
    const form = { ...state.form, distributorID: address };
    setState((prevState) => ({ ...prevState, form }));
  };

  const AddRetailer = async () => {
    const address = await getMetaskAccountID();
    const isRetailer = await state.contract.methods
      .isRetailer(address)
      .call({ from: address });

    if (!isRetailer) {
      await state.contract.methods.addRetailer(address).send({ from: address });
    }
    const form = { ...state.form, retailerID: address };
    setState((prevState) => ({ ...prevState, form }));
  };

  const AddConsumer = async () => {
    const address = await getMetaskAccountID();
    const isConsumer = await state.contract.methods
      .isConsumer(address)
      .call({ from: address });

    if (!isConsumer) {
      await state.contract.methods.addConsumer(address).send({ from: address });
    }
    const form = { ...state.form, consumerID: address };
    setState((prevState) => ({ ...prevState, form }));
  };

  const createUsers = () => {
    return (
      <>
        <button
          className="button is-primary mr-5"
          id="button"
          type="button"
          onClick={AddFarmer}
        >
          Add Farmer
        </button>
        <button
          className="button is-link mr-5"
          id="button"
          type="button"
          onClick={AddDistributor}
        >
          Add Distributor
        </button>
        <button
          className="button is-info mr-5"
          id="button"
          type="button"
          onClick={AddRetailer}
        >
          Add Retailer
        </button>
        <button
          className="button is-success"
          id="button"
          type="button"
          onClick={AddConsumer}
        >
          Add Consumer
        </button>
      </>
    );
  };

  const productDetail = () => {
    return (
      <>
        <div className="container">
          <section className="section has-background-success-light">
            <div className="hero">
              <div className="title">
                <h2>Product Details</h2>
              </div>
              <div className="body">
                <div className="form-group">
                  Product Notes
                  <br />
                  <input
                    type="text"
                    id="productNotes"
                    name="productNotes"
                    value={state.form.productNotes}
                    size="60"
                    onChange={onChange}
                  />
                  <br />
                  Product Price
                  <br />
                  <input
                    type="number"
                    id="productPrice"
                    name="productPrice"
                    onChange={onChange}
                    value={state.form.productPrice}
                  />
                  ETH
                  <br />
                  Distributor ID
                  <br />
                  {state.form.distributorID}
                  <br />
                  Retailer ID
                  <br />
                  {state.form.retailerID}
                  <br />
                  Consumer ID
                  <br />
                  {state.form.consumerID}
                  <br />
                  <br />
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="5"
                    onClick={BuyItem}
                    disabled={state.form.distributorID === null}
                  >
                    Buy
                  </button>
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="6"
                    onClick={ShipItem}
                    disabled={state.form.originFarmerID === null}
                  >
                    Ship
                  </button>
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="7"
                    onClick={ReceiveItem}
                    disabled={state.form.retailerID === null}
                  >
                    Receive
                  </button>
                  <button
                    className="button mr-5"
                    id="button"
                    type="button"
                    data-id="8"
                    onClick={PurchaseItem}
                    disabled={state.form.consumerID === null}
                  >
                    Purchase
                  </button>
                  {state.form.distributorID === null && (
                    <div class="notification has-background-danger-light mt-2">
                      First you have to Add a Distributor
                    </div>
                  )}
                  {state.form.retailerID === null && (
                    <div class="notification has-background-danger-light mt-2">
                      First you have to Add a Retailer
                    </div>
                  )}
                  {state.form.consumerID === null && (
                    <div class="notification has-background-danger-light mt-2">
                      First you have to Add a Consumer
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  };

  return (
    <>
      {state.web3 && (
        <div className="App">
          <h1 className="AppTitle">Fair Trade Coffee</h1>
          <hr />
          <p className="AppSubTitle">
            Prove the authenticity of coffee using the Ethereum blockchain.
          </p>
          {state.form && (
            <>
              {createUsers()}
              {productOverview()}
              {farmDetails()}
              {productDetail()}
            </>
          )}
        </div>
      )}
      {state.web3 === null && (
        <p className="AppSubTitle">
          Failed to load web3, accounts, or contract. Check console for details.
        </p>
      )}
    </>
  );
};

export default App;
