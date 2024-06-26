import React, { Fragment, useState, useEffect } from "react";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";
import MetaData from "components/layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Form,
  Input,
  Label,
  Badge,
} from "reactstrap";
import { MDBDataTable } from "mdbreact";
import swal from "sweetalert";
import {
  createAddress,
  allAddress,
  singleAddress,
  updateAddress,
  deleteAddress,
  clearErrors,
  setDefaultAddress,
} from "actions/addressAction";
import {
  CREATE_ADDRESS_RESET,
  UPDATE_ADDRESS_RESET,
  DELETE_ADDRESS_RESET,
  SET_ADDRESS_RESET,
} from "constants/addressConstants";

import L from "leaflet";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import osm from "./../admin/osm-providers";
import { useRef } from "react";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate hook from react-router-dom
  const { user, loading } = useSelector((state) => state.auth);
  const { addresscreated } = useSelector((state) => state.newAddress);
  const { useraddress } = useSelector((state) => state.allAddress);
  const { isDeleted, isUpdated, error, isDefault } = useSelector(
    (state) => state.addressrecord
  );
  const { addressdetails } = useSelector((state) => state.singleAddress);
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!isModalOpen);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm();

  const [houseNo, setHouseNo] = useState("");
  const [streetName, setStreetName] = useState("");
  const [purokNum, setPurokNum] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [modalID, setModalID] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSearch = (result) => {
    setCenter({ lat: result.y, lng: result.x });
  };

  const [editcenter, setEditCenter] = useState({
    lat: 14.493945331650867,
    lng: 121.0518236625988,
  });

  useEffect(() => {
    dispatch(allAddress());
    // console.group(modalID);
    if (addresscreated) {
      console.log("success ");
      swal("New Address is Added!", "", "success");
      toggleModal();
      navigate("/my-profile", { replace: true });
      dispatch({
        type: CREATE_ADDRESS_RESET,
      });
      resetForm();
    }

    if (addressdetails && addressdetails._id !== modalID) {
      dispatch(singleAddress(modalID));
    } else {
      if (addressdetails) {
        setHouseNo(addressdetails.houseNo);
        setStreetName(addressdetails.streetName);
        setPurokNum(addressdetails.purokNum);
        setBarangay(addressdetails.barangay);
        setCity(addressdetails.city);
        if (
          addressdetails.latitude !== editcenter.lat ||
          addressdetails.longitude !== editcenter.lng
        ) {
          console.log("Updating editCenter...");
          console.log("New editCenter:", {
            lat: addressdetails.latitude,
            lng: addressdetails.longitude,
          });

          setTimeout(() => {
            setEditCenter({
              lat: addressdetails.latitude,
              lng: addressdetails.longitude,
            });
          }, 2000); // Delay of 100 milliseconds before updating editCenter
          console.log("Updated editCenter...", editcenter);
        } else {
          console.log("editCenter already up to date:", editcenter);
        }
      }


      const EditinitializeMap = () => {
        if (editmapRef.current) {
          const editsearchControl = new GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: "bar",
            showMarker: false,
            onResultClick: handleSearch,
          });
          editmapRef.current.addControl(editsearchControl);
        } else {
          setTimeout(EditinitializeMap, 100);
        }
      };

      EditinitializeMap();
    }

    if (isUpdated) {
      swal("Updated Successfully!", "", "success");

      navigate("/my-profile", { replace: true });
      dispatch({
        type: UPDATE_ADDRESS_RESET,
      });

      toggleEditModal();
      setHouseNo("");
      setStreetName("");
      setPurokNum("");
      setBarangay("");
      setCity("");
    }

    if (error) {
      swal(error, "", "error");
      dispatch(clearErrors());
    }

    if (isDeleted) {
      navigate("/my-profile");
      dispatch({ type: DELETE_ADDRESS_RESET });
    }
    if (isDefault) {
      navigate("/my-profile");
      dispatch({ type: SET_ADDRESS_RESET });
    }

    const initializeMap = () => {
      if (mapRef.current) {
        const searchControl = new GeoSearchControl({
          provider: new OpenStreetMapProvider(),
          style: "bar",
          showMarker: false,
          onResultClick: handleSearch,
        });
        mapRef.current.addControl(searchControl);
      } else {
        setTimeout(initializeMap, 100);
      }
    };
    initializeMap();
  }, [
    dispatch,
    addresscreated,
    addressdetails,
    modalID,
    isUpdated,
    error,
    isDeleted,
    isDefault,
  ]);

  const submitHandler = (e) => {
    //e.preventDefault();

    const formData = new FormData();
    formData.set("houseNo", e.houseNo);
    formData.set("streetName", e.streetName);
    formData.set("purokNum", e.purokNum);
    formData.set("barangay", e.barangay);
    formData.set("latitude", latitude);
    formData.set("longitude", longitude);
    formData.set("city", e.city);
    dispatch(createAddress(formData));
  };

  const updateHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("houseNo", houseNo);
    formData.append("streetName", streetName);
    formData.append("purokNum", purokNum);
    formData.append("barangay", barangay);
    formData.append("city", city);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    dispatch(updateAddress(modalID, formData));

    console.log(formData);
  };
  //console.log("State values:", houseNo, streetName, purokNum, barangay, city);
  const deleteHandler = (id) => {
    swal({
      title: "Are you sure you want to delete this address?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Address has been deleted!", "", "success");
        dispatch(deleteAddress(id));
      } else {
        swal("Address is not deleted!", "", "info");
      }
    });
  };

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const toggleEditModal = () => setEditModalOpen(!isEditModalOpen);

  const EditModal = (id) => {
    setModalID(id);
    toggleEditModal();
  };

  const setDefAddress = (id) => {
    dispatch(setDefaultAddress(id));
    swal("Set Default Address Sucessfully", "", "success");
  };

  const setAddresses = () => {
    const data = {
      columns: [
        {
          label: "Address",
          field: "address",
          sort: "asc",
        },
        {
          label: "Set Default",
          field: "default",
          sort: "asc",
        },

        {
          label: "Actions",
          field: "actions",
        },
      ],

      rows: [],
    };

    useraddress.forEach((useraddresses) => {
      data.rows.push({
        address: `${useraddresses.houseNo} ${useraddresses.purokNum} ${useraddresses.streetName} ${useraddresses.barangay} ${useraddresses.city}`,
        actions: (
          <Fragment>
            <button
              className="btn btn-primary py-1 px-2 ml-2"
              onClick={() => EditModal(useraddresses._id)}>
              <i className="fa fa-info-circle"></i>
            </button>

            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteHandler(useraddresses._id)}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
        default: (
          <Fragment>
            <Badge
              color={useraddresses.isDefault ? "success" : "secondary"}
              // href=""
              onClick={() => setDefAddress(useraddresses._id)}
              style={{ cursor: "pointer" }}>
              {useraddresses.isDefault ? "Default" : "Default"}
            </Badge>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const [center, setCenter] = useState({
    lat: 14.493945331650867,
    lng: 121.0518236625988,
  });

  const editmapRef = useRef();

  const ZOOM_LEVEL = 18;
  const mapRef = useRef();
  const [marker, setMarker] = useState(null);

  const handleMarkerCreated = (e) => {
    const newMarker = e.layer;
    console.log(newMarker);

    setMarker((prevMarker) => {
      if (prevMarker) {
        prevMarker.remove();
      }

      return newMarker;
    });

    const { lat, lng } = newMarker.getLatLng();
    console.log(lat, lng);
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <>
      <AuthNavbar />
      <MetaData title={"My Profile"} />

      <div
        className="user-profile-container"
        style={{
          minHeight: "700px",
          marginTop: "100px",
          marginLeft: "15%",
          marginRight: "15%",
        }}>
        <div className="row">
          <div className="col-md-12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My Profile</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="heading-small text-muted mb-4">
                  User information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="3">
                      <div className="text-center">
                        <img
                          className="avatar border-gray"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "40%",
                          }}
                          src={user && user.avatar && user.avatar.url}
                          alt="User"
                        />
                        <div className="button-container text-center">
                          <div className="btn-container d-block">
                            <button
                              className="btn btn-info btn-sm mb-2"
                              onClick={() => navigate("/me/update")}>
                              Edit Profile
                            </button>
                          </div>

                          <div className="btn-container d-block">
                            <button
                              className="btn btn-info btn-sm mb-2"
                              onClick={() => navigate("/my-qr")}>
                              My QR Code
                            </button>
                          </div>
                          <div className="btn-container d-block">
                            <button
                              className="btn btn-info btn-sm mb-2"
                              onClick={() => navigate("/password/update")}>
                              Change Password
                            </button>
                          </div>
                          <div className="btn-container d-block">
                            <Button
                              color="info"
                              size="sm"
                              className="mb-3"
                              onClick={toggleModal}>
                              Add Address
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg="9">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name">
                              First name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-first-name"
                              type="text"
                              value={user ? user.fname : ""}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name">
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-last-name"
                              type="text"
                              value={user ? user.lname : ""}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email">
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              type="email"
                              value={user ? user.email : ""}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address">
                              Phone No.
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-phone"
                              type="text"
                              value={user ? user.phone : ""}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                {/* Address */}
                <h6 className="heading-small text-muted mb-4">Addresses</h6>

                <Modal isOpen={isModalOpen} toggle={toggleModal}>
                  <ModalHeader toggle={toggleModal}>Add Address</ModalHeader>

                  <Form role="form" onSubmit={handleSubmit(submitHandler)}>
                    <ModalBody>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni ni-pin-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <input
                            placeholder="House No..."
                            className="form-control"
                            type="text"
                            name="houseNo"
                            {...register("houseNo", {
                              required: "Please enter a valid house no.",
                            })}
                          />
                        </InputGroup>
                        {errors.houseNo && (
                          <h2
                            className="h1-seo"
                            style={{ color: "red", fontSize: "small" }}>
                            {errors.houseNo.message}
                          </h2>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni ni-pin-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <input
                            placeholder="Purok No."
                            className="form-control"
                            type="text"
                            name="purokNum"
                            {...register("purokNum", {
                              required: "Please enter a valid purok no.",
                            })}
                          />
                        </InputGroup>
                        {errors.purokNum && (
                          <h2
                            className="h1-seo"
                            style={{ color: "red", fontSize: "small" }}>
                            {errors.purokNum.message}
                          </h2>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-mobile-button" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <input
                            placeholder="Street Name..."
                            className="form-control"
                            type="text"
                            name="streetName"
                            {...register("streetName", {
                              required: "Please enter a valid house no.",
                            })}
                          />
                        </InputGroup>
                        {errors.streetName && (
                          <h2
                            className="h1-seo"
                            style={{ color: "red", fontSize: "small" }}>
                            {errors.streetName.message}
                          </h2>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-pin-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <select
                            className="form-control"
                            name="barangay"
                            {...register("barangay", {
                              required: "Please select a barangay.",
                            })}>
                            <option value="" disabled selected>
                              Select Barangay...
                            </option>
                            <option value="Bagumbayan">Bagumbayan</option>
                            <option value="Bambang">Bambang</option>
                            <option value="Calzada">Calzada</option>
                            <option value="Central Bicutan">
                              Central Bicutan
                            </option>
                            <option value="Central Signal Village">
                              Central Signal Village
                            </option>
                            <option value="Fort Bonifacio">
                              Fort Bonifacio
                            </option>
                            <option value="Hagonoy">Hagonoy</option>
                            <option value="Ibayo-Tipas">Ibayo-Tipas</option>
                            <option value="Katuparan">Katuparan</option>
                            <option value="Ligid-Tipas">Ligid-Tipas</option>
                            <option value="Lower Bicutan">Lower Bicutan</option>
                            <option value="Maharlika Village">
                              Maharlika Village
                            </option>
                            <option value="Napindan">Napindan</option>
                            <option value="New Lower Bicutan">
                              New Lower Bicutan
                            </option>
                            <option value="North Daang Hari">
                              North Daang Hari
                            </option>
                            <option value="North Signal Village">
                              North Signal Village
                            </option>
                            <option value="Palingon">Palingon</option>
                            <option value="Pinagsama">Pinagsama</option>
                            <option value="San Miguel">San Miguel</option>
                            <option value="Santa Ana">Santa Ana</option>
                            <option value="Sta. Cruz">Sta. Cruz</option>
                            <option value="Tanyag">Tanyag</option>
                            <option value="Tuktukan">Tuktukan</option>
                            <option value="Upper Bicutan">Upper Bicutan</option>
                            <option value="Ususan">Ususan</option>
                            <option value="South Daang Hari">
                              South Daang Hari
                            </option>
                            <option value="South Signal Village">
                              South Signal Village
                            </option>
                            <option value="Wawa">Wawa</option>
                            <option value="Western Bicutan">
                              Western Bicutan
                            </option>
                          </select>
                        </InputGroup>
                        {errors.barangay && (
                          <h2
                            className="h1-seo"
                            style={{ color: "red", fontSize: "small" }}>
                            {errors.barangay.message}
                          </h2>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-pin-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <select
                            className="form-control"
                            name="city"
                            {...register("city", {
                              required: "Please select a city.",
                            })}>
                            <option value="" disabled selected>
                              Select City...
                            </option>
                            <option value="Taguig City">Taguig City</option>
                          </select>
                        </InputGroup>
                        {errors.city && (
                          <h2
                            className="h1-seo"
                            style={{ color: "red", fontSize: "small" }}>
                            {errors.city.message}
                          </h2>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <MapContainer
                          center={center}
                          zoom={ZOOM_LEVEL}
                          ref={mapRef}>
                          <FeatureGroup>
                            <EditControl
                              position="topright"
                              onCreated={handleMarkerCreated}
                              draw={{
                                polygon: false,
                                rectangle: false,
                                circle: false,
                                circlemarker: false,
                                marker: true,
                                polyline: false,
                              }}
                            />
                          </FeatureGroup>
                          <TileLayer
                            url={osm.maptiler.url}
                            attribution={osm.maptiler.attribution}
                          />
                        </MapContainer>
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" type="submit">
                        Register
                      </Button>{" "}
                      <Button color="secondary" onClick={toggleModal}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                </Modal>

                <MDBDataTable
                  data={setAddresses()}
                  className="px-3"
                  bordered
                  hover
                  noBottomColumns
                  responsive
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Address</ModalHeader>
        <Form onSubmit={updateHandler} encType="multipart/form-data">
          <ModalBody>
            <FormGroup>
              <label className="form-control-label">
                Unit, Building, House No.
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Unit, Building, House No."
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <label className="form-control-label">Purok No.</label>
              <input
                type="text"
                className="form-control"
                placeholder="Purok No."
                value={purokNum}
                onChange={(e) => setPurokNum(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label">Street Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street Name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label">Barangay</label>
              <select
                className="form-control"
                id="barangaySelect"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}>
                <option value="" disabled>
                  Select Barangay
                </option>
                <option value="Bagumbayan">Bagumbayan</option>
                <option value="Bambang">Bambang</option>
                <option value="Calzada">Calzada</option>
                <option value="Central Bicutan">Central Bicutan</option>
                <option value="Central Signal Village">
                  Central Signal Village
                </option>
                <option value="Fort Bonifacio">Fort Bonifacio</option>
                <option value="Hagonoy">Hagonoy</option>
                <option value="Ibayo-Tipas">Ibayo-Tipas</option>
                <option value="Katuparan">Katuparan</option>
                <option value="Ligid-Tipas">Ligid-Tipas</option>
                <option value="Lower Bicutan">Lower Bicutan</option>
                <option value="Maharlika Village">Maharlika Village</option>
                <option value="Napindan">Napindan</option>
                <option value="New Lower Bicutan">New Lower Bicutan</option>
                <option value="North Daang Hari">North Daang Hari</option>
                <option value="North Signal Village">
                  North Signal Village
                </option>
                <option value="Palingon">Palingon</option>
                <option value="Pinagsama">Pinagsama</option>
                <option value="San Miguel">San Miguel</option>
                <option value="Santa Ana">Santa Ana</option>
                <option value="Sta. Cruz">Sta. Cruz</option>
                <option value="Tanyag">Tanyag</option>
                <option value="Tuktukan">Tuktukan</option>
                <option value="Upper Bicutan">Upper Bicutan</option>
                <option value="Ususan">Ususan</option>
                <option value="South Daang Hari">South Daang Hari</option>
                <option value="South Signal Village">
                  South Signal Village
                </option>
                <option value="Wawa">Wawa</option>
                <option value="Western Bicutan">Western Bicutan</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label className="form-control-label">City</label>
              <select
                className="form-control"
                id="citySelect"
                value={city}
                onChange={(e) => setCity(e.target.value)}>
                <option value="" disabled>
                  Select City
                </option>
                <option value="Taguig City">Taguig City</option>
              </select>
            </FormGroup>

            <FormGroup>
              <MapContainer
                center={editcenter}
                zoom={ZOOM_LEVEL}
                ref={editmapRef}>
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onCreated={handleMarkerCreated}
                    draw={{
                      polygon: false,
                      rectangle: false,
                      circle: false,
                      circlemarker: false,
                      marker: true,
                      polyline: false,
                    }}
                  />
                </FeatureGroup>
                <TileLayer
                  url={osm.maptiler.url}
                  attribution={osm.maptiler.attribution}
                />
              </MapContainer>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Save Changes
            </Button>{" "}
            <Button color="secondary" onClick={toggleEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <AuthFooter />
    </>
  );
};

export default Profile;
