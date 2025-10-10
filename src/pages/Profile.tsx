import { Col, Row, TabContainer, Nav, NavItem, NavLink, TabContent, TabPane, CardImg, CardBody, CardFooter, Card, CardHeader } from "react-bootstrap";
import "./css/style.css";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import { GET, POST, POSTMedia } from "../utils/Utils";
import { GET_LOCATION_DATA_URL, GET_PROFILE_INFORMATION, GET_REQUESTS_URL, UPDATE_PROFILE_INFORMATION, UPLOAD_PROFILE_IMAGE } from "../state/Constants";
import { City, Country, State, UserProfileInformation } from "../state/Types";

type UserRequest = {
    id: string,
    wall_image: string,
    model_image: string,
    request_status: string,
    user_uploaded_image: string
}

export default function Profile(){
    const [requests, setRequests] = useState<UserRequest[]>();
    const [pendingRequests, setPendingRequests] = useState<number>(0);
    const getRequests = () => {
        GET(GET_REQUESTS_URL, (request: any) => {
            if (request.data.status == "ok"){
                setRequests(request.data.requests);
            }
        }, (request: any) => {
            console.log(request)
        });
    }

    const [updateInformation, setUpdateInformation] = useState(false);

    const saveInformation = async() => {
        const data = {
            firstName: (document.getElementById("firstName") as HTMLInputElement).value,
            lastName: (document.getElementById("lastName") as HTMLInputElement).value,
            email: (document.getElementById("email") as HTMLInputElement).value,
            country: (document.getElementById("country") as HTMLInputElement).value,
            state: (document.getElementById("state") as HTMLInputElement).value,
            city: (document.getElementById("city") as HTMLInputElement).value,
            street: (document.getElementById("street") as HTMLInputElement).value
        }
        POST(UPDATE_PROFILE_INFORMATION, data, () => {
          setUpdateInformation(false);
          alert("Successfully Updated Profile Information");

        }, () => {

        })
    }

    const [profileInformation, setProfileInformation] = useState<UserProfileInformation>();
    const getProfileInformation = async() => {
        GET(GET_PROFILE_INFORMATION, (request: any) => {
            setProfileInformation(request.data.profileInformation)
            getStates(request.data?.profileInformation?.country?.id);
            getCities(request.data?.profileInformation?.state?.id);
        }, () => {

        })
    }

    const [countries, setCountries] = useState<Country[]>();
    
    const getCountries = () => {
      GET(GET_LOCATION_DATA_URL, (response: any) => {
         setCountries(response.data.countries);
      });
    }

    const [states, setStates] = useState<State[]>();
    const getStates = (countryID: number) => {
      GET(GET_LOCATION_DATA_URL + `?country=${countryID}`, (response: any) => {
        setStates(response.data.states);
      });
    };

    const [cities, setCities] = useState<City[]>();
    const getCities = (stateID: number) => {
      GET(GET_LOCATION_DATA_URL + `?state=${stateID}`, (response: any) => {
        setCities(response.data.cities);
      });
    };


    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            getRequests();
            getProfileInformation();
            setPendingRequests(0);
            getCountries();
            requests?.forEach((request) => {
              if (request.request_status == "Pending") {
                setPendingRequests((oldValue) => oldValue + 1);
              }
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
      <Row className="pt-5 mt-4 vh-100">
        <TabContainer defaultActiveKey={"dashboard"}>
          <Col xs={1} md={3} lg={2} style={{ backgroundColor: "#2244FF11" }}>
            <Nav variant="pills" className="flex-column">
              <NavItem>
                <NavLink eventKey={"dashboard"}>Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={"settings"}>Settings</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={"requests"}>Requests</NavLink>
              </NavItem>
            </Nav>
          </Col>

          <Col xs={11} md={9} lg={10}>
            <TabContent>
              <TabPane eventKey={"dashboard"}>
                <Col xs={12}>
                  <Row className="gap-2 px-5">
                    <Card
                      className="admin-dashboard-card border-0"
                      style={{ width: "200px" }}
                    >
                      <CardHeader className="fs-5">Total Requests</CardHeader>
                      <CardBody className="fs-4 text-center">
                        {requests?.length}
                      </CardBody>
                    </Card>

                    <Card
                      className="admin-dashboard-card border-0"
                      style={{ width: "250px" }}
                    >
                      <CardHeader className="fs-5">Peding Requests</CardHeader>
                      <CardBody className="fs-4 text-center">
                        {pendingRequests}
                      </CardBody>
                    </Card>

                    <Card
                      className="admin-dashboard-card border-0"
                      style={{ width: "250px" }}
                    >
                      <CardHeader className="fs-5">
                        Authorized Requests
                      </CardHeader>
                      <CardBody className="fs-4 text-center">512</CardBody>
                    </Card>
                  </Row>
                </Col>
              </TabPane>

              <TabPane eventKey={"settings"}>
                <Col xs={12} className="pt-3">
                  <Row className="justify-content-end px-lg-5 pb-4">
                    <Col
                      xs={12}
                      className="d-flex justify-content-end pt-2 gap-2 px-lg-3"
                    >
                      <button
                        className={
                          "btn w-auto " +
                          (updateInformation ? "btn-danger" : "btn-primary")
                        }
                        onClick={() => {
                          setUpdateInformation(!updateInformation);
                        }}
                      >
                        {updateInformation ? "Cancel" : "Update"}
                      </button>
                      {updateInformation ? (
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            saveInformation();
                          }}
                        >
                          SAVE
                        </button>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                  <Row className="justify-content-evenly">
                    <Col
                      xs={12}
                      md={6}
                      className="p-3 rounded-2"
                      style={{ backgroundColor: "#2244FF22" }}
                    >
                      <Row>
                        <Col
                          xs={12}
                          md={4}
                          className="d-flex flex-column justify-content-center align-items-center px-4"
                        >
                          <div
                            style={{
                              width: "150px",
                              height: "150px",
                              background: `url(${selectedFile ? URL.createObjectURL(selectedFile) : profileInformation?.profileImage})`,
                              backgroundSize: "150px 150px",
                              objectFit: "fill",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundColor: "#2244FF33",
                            }}
                          ></div>
                          <label
                            className="text-center mt-3"
                            htmlFor="profile-image-selector"
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: "7px",
                              cursor: "pointer",
                              color: "#FFF",
                              backgroundColor: selectedFile ? "#FF0000" : "#2244FFAA",
                            }}
                            onClick={(event) => {
                              if (selectedFile){
                                setSelectedFile(null);
                                event.preventDefault();
                              }
                            }}
                          >
                            {selectedFile !== null ? "CANCEL" : "SELECT"}
                          </label>
                          <input
                            id="profile-image-selector"
                            type="file"
                            onChange={(event) => {
                              const files = event.target.files;
                              // alert(files?.length);
                              if (files){
                                if (files.length > 0){
                                  setSelectedFile(files[0]);
                                }
                              }
                            }}
                            hidden={true}
                          />
                          <button className="btn btn-dark mt-2 w-100" onClick={() => {
                            POSTMedia(UPLOAD_PROFILE_IMAGE, {profileImage: selectedFile}, () => {
                              alert("Profile Image Uploaded Successfully!");
                            }, () => {});
                          }}>
                            UPLOAD
                          </button>
                        </Col>
                        <Col xs={12} md={8}>
                          <Row>
                            <Col xs={12} md={6}>
                              <label htmlFor="firstName">First Name</label>
                              <input
                                type="text"
                                id="firstName"
                                defaultValue={profileInformation?.firstName}
                                className="form-control"
                              />
                            </Col>
                            <Col xs={12} md={6}>
                              <label htmlFor="firstName">Last Name</label>
                              <input
                                type="text"
                                id="lastName"
                                defaultValue={profileInformation?.lastName}
                                className="form-control"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
                              <label className="" htmlFor="email">
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                defaultValue={profileInformation?.email}
                                className="form-control"
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                    <Col
                      xs={12}
                      md={5}
                      className="p-3 rounded-2"
                      style={{ backgroundColor: "#2244FF22" }}
                    >
                      <Row>
                        <Col xs={12} md={4}>
                          <label htmlFor="country">Country</label>
                          <select
                            id="country"
                            className="form-select"
                            onChange={(event) => {
                              getStates(parseInt(event.target.value));
                            }}
                          >
                            {countries?.map((country) => {
                              return (
                                <option
                                  selected={
                                    profileInformation?.country.id == country.id
                                  }
                                  value={country.id}
                                >
                                  {country.name}
                                </option>
                              );
                            })}
                          </select>
                        </Col>
                        <Col xs={12} md={4}>
                          <label htmlFor="state">State</label>
                          <select
                            id="state"
                            className="form-select"
                            onChange={(event) => {
                              getCities(parseInt(event.target.value));
                            }}
                          >
                            {states?.map((state) => {
                              return (
                                <option
                                  selected={
                                    profileInformation?.state.id == state.id
                                  }
                                  value={state.id}
                                >
                                  {state.name}
                                </option>
                              );
                            })}
                          </select>
                        </Col>
                        <Col xs={12} md={4}>
                          <label className="" htmlFor="city">
                            City
                          </label>
                          <select id="city" className="form-select">
                            {cities?.map((city) => {
                              return (
                                <option
                                  selected={
                                    profileInformation?.city?.id == city.id
                                  }
                                  value={city.id}
                                >
                                  {city.name}
                                </option>
                              );
                            })}
                          </select>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={12}>
                          <label className="" htmlFor="street">
                            Street
                          </label>
                          <input
                            type="text"
                            id="street"
                            defaultValue={profileInformation?.street}
                            className="form-control"
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </TabPane>

              <TabPane eventKey={"requests"}>
                <Col xs={12} className="pt-3">
                  <Row className="gap-4">
                    <Col
                      xs={6}
                      md={3}
                      lg={1}
                      className="fs-3 fw-bolder d-flex align-items-center"
                    >
                      Requests
                    </Col>
                    <Col xs={6} md={9} lg={10}>
                      <a href="/order-an-art" className=" text-decoration-none">
                        <button className="btn btn-primary new-request-button d-flex align-items-center gap-2">
                          <CiCirclePlus size={28} color="#FFF" />
                          New Request
                        </button>
                      </a>
                    </Col>
                  </Row>
                  <Row className="pt-4">
                    {requests?.map((request) => (
                      <Col xs={12} md={4} lg={3} xl={2}>
                        <Card className="request-card">
                          <CardImg
                            src={request.user_uploaded_image}
                            style={{
                              width: "auto",
                              height: "250px",
                              objectFit: "contain",
                            }}
                          />
                          <CardBody className="d-flex justify-content-center align-items-center">
                            <img
                              src={request.model_image}
                              style={{ width: "50px", height: "50px" }}
                            />
                            <img
                              src={request.wall_image}
                              style={{ width: "50px", height: "50px" }}
                            />
                          </CardBody>
                          <CardFooter className="ps-3 fs-5 fs-semibold">
                            <Row className="justify-content-center">
                              {request.request_status}
                            </Row>
                          </CardFooter>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </TabPane>
            </TabContent>
          </Col>
        </TabContainer>
      </Row>
    );
}