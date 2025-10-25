import { ReactElement, useEffect, useState,  useRef, ReactNode } from "react";
import { Accordion, AccordionBody, AccordionHeader, ButtonGroup, Card, CardBody, CardHeader, Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane, ToggleButton } from "react-bootstrap";

import "../css/style.css";
import { ADD_NEW_CATEGORY_URL, ADD_SIZE_URL, CHANGE_REQUEST_STATUS, DELETE_CATEGORY, DELETE_MODEL_IMAGE, DELETE_PREVIEW_IMAGE, GET_CATEGORIES_URL, GET_PREVIEW_IMAGE, GET_REQUESTS_URL, GET_SIZES_URL, GET_STATUSES_URL, POST_WALL_IMAGES_URL, RENAME_CATEGORY } from "../../state/Constants";
import { GET, POST, POSTMedia } from "../../utils/Utils";
import { Category, ModelImage, PaintingRequestStatus, Size, Variation, WallImage } from "../../state/Types";
import { CheckCircle, CheckCircleFill, ClockHistory, PencilFill, Trash, TrashFill } from "react-bootstrap-icons";
import Toast from "./controls/Toast";
import AddEditProduct from "./pages/AddEditProduct";
import Variations from "./pages/Settings/Variations";
import PagesSettings from "./pages/Settings/PagesSettings";


type PaintRequest = {
    id: number,
    wall_image: string,
    model_image: string,
    request_status: string,
    datetime: Date,
    nextStatus?: {id: number, status: string},
    user_uploaded_image: string,
    user: {
            userID: number,
            firstName: string,
            lastName: string
        }
}


export default function Admin(): ReactElement{
    // const [toastText, setToastText] = useState("");
    // const [showToast, setShowToast] = useState(false);

    const [toast, setToast] = useState<ReactNode | null | string>();


    // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const displayToast = (message: string) => {
      console.log(message);
        // setToastText(message);
        // setShowToast(true);

        // const timeout = setTimeout(() => {
            // setToastText("");
            // setShowToast(false);
        // }, 2000);

        // clearTimeout(timeout);
    }

    const createCategory = async() => {
        const categoryNameInput = document.getElementById("category-name-field") as HTMLInputElement;

        POST(ADD_NEW_CATEGORY_URL, {category: categoryNameInput.value}, (response: any) => {

            const data = response.data;
            if (data.status == "ok"){
                displayToast("Category Created Successfully!");
            }else{
                displayToast("Failed Creating The Category! Try again!");
            }
        }, (response: any) => {
            console.log(response);
            displayToast("Failed Creating The Category! Try again!");
        });
    }

    const [categories, setCategories] = useState<Category[]>([]);
    const getCategories = async() => {
        GET(GET_CATEGORIES_URL, (response: any) => {
            if (response.data.status == "ok"){
                setCategories(response.data.categories);
            }
        }, (response: any) => {
            console.log(response.data.message);
        });
    }


    const [previewImages, setPreviewImages] = useState<WallImage[]>([]);
    const getPreviewImages = async () => {
      GET(
        GET_PREVIEW_IMAGE,
        (response: any) => {
          const data = response.data;
          setPreviewImages(data.previewImages);
        },
        (response: any) => {
          console.log(response);
        }
      );
    };

    const deletePreviewImage = async (id: number) => {
      POST(
        DELETE_PREVIEW_IMAGE,
        {imageID: id},
        (response: any) => {
          const data = response.data;
          setPreviewImages(data.previewImages);
        },
        (response: any) => {
          console.log(response);
        }
      );
    };

    // const uploadModelImages = (data: any) => {
    //     POSTMedia(POST_MODEL_IMAGES_URL, data, (response: any) => {
    //         if (response.status == "ok"){
    //             displayToast("Image Uploaded Successfully!");
    //         }else{
    //             displayToast("Image Uploaded Unsuccessful!");
    //         }
    //     }, (response: any) => {
    //         console.log(response);
    //         displayToast("Image Uploaded Unsuccessful!");
    //     });
    // }

    
    const changeRequestStatus = async(requestID: number, statusID: number) => {
        POST(CHANGE_REQUEST_STATUS, {requestID: requestID, newStatusID: statusID}, (response: any) => {
            if(response.data.status == "ok"){

            }
        }, (response: any) => {
            console.log(response);
        })
    }


    const [openWallImageUploadDialogBox, setOpenWallImageUploadDialogBox] = useState(false);
    const [selectedImagesOfTheWall, setSelectedImagesOfTheWall] = useState<File[]>([]);
    const [selectedModelImage, setSelectedModelImage] = useState<ModelImage | null>();

    const uploadImagesOnTheWall = (data: any) => {
        POSTMedia(POST_WALL_IMAGES_URL, data, (response: any) => {
            if (response.status == "ok"){
                displayToast("Image Uploaded Successfully!");
            }else{
                displayToast("Image Uploaded Unsuccessful!");
            }
        }, (response: any) => {
            console.log(response);
            displayToast("Image Uploaded Unsuccessful!");
        });
    };


    const [requests, setRequests] = useState<PaintRequest[]>();
    const [pendingRequests, setPendingRequests] = useState(0);
    const getRequests = () => {
        GET(GET_REQUESTS_URL, (request: any) => {
            if (request.data.status == "ok"){
                setRequests(request.data.requests);
            }
        }, (request: any) => {
            console.log(request)
        });
    }

    const [statuses, setStatuses] = useState<PaintingRequestStatus[]>();
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<String | null>("All");
    const getStatuses = () => {
        GET(GET_STATUSES_URL, (request: any) => {
          // alert(JSON.stringify(request.data.statuses));
            setStatuses(request.data.statuses);
        }, () => {

        });
    }

    const [addPaintingSizeDialogBoxVisibility, setAddPaintingSizeDialogBoxVisibility] = useState<boolean>(false);
    const addPaintingSizeDialogBoxVisibilityRef = useRef(addPaintingSizeDialogBoxVisibility);
    const setAddPaintingSizeDialogBoxVisibilityRef = (data: boolean) => {
      setAddPaintingSizeDialogBoxVisibility(data);
      addPaintingSizeDialogBoxVisibilityRef.current = data;
    }

    const [sizes, setSizes] = useState<Size[]>();
    const getSizes = () => {
      GET(GET_SIZES_URL, (response: any) => {
        setSizes(response.data.sizes);
      }, () => {});
    }

    const addSize = (size: string, width: number, height: number, unit: string, price: number) => {
      POST(ADD_SIZE_URL, {size: size, width: width, height: height, unit: unit, price: price}, (response: any) => {
        if(response.data.status == "ok"){
          setAddPaintingSizeDialogBoxVisibilityRef(false);
        }
      }, () => {});

    }

    // const [addProductDialogVisible, setAddProductDialogVisible] = useState(false);
    // const addProductDialogVisibleRef = useRef(addProductDialogVisible);
    // const setAddProductDialogVisibleRef = (data: boolean) => {
    //   setAddProductDialogVisible(data);
    //   addProductDialogVisibleRef.current = data;
    // };

    // const [editProductDialogBoxVisible, setEditProductDialogBoxVisible] = useState(false);
    // const editProductDialogBoxVisibleRef = useRef(editProductDialogBoxVisible);
    // const setEditProductDialogBoxVisibleRef = (data: boolean) => {
    //   setEditProductDialogBoxVisible(data);
    //   editProductDialogBoxVisibleRef.current = data;
    // }

    // const [productAddUpdateStatusMessage, setProductAddUpdateStatusMessage] = useState<string | null>(null);
    // const [selectedCategoryForNewImage, setSelectedCategoryForNewImage] = useState<number | null>(null);
    // const [imageSelected, setImageSelected] = useState<boolean>(false);
    // const imageSelectedRef = useRef(imageSelected);
    // const setImageSelectedRef = (data: boolean) => {
    //   setImageSelected(data);
    //   imageSelectedRef.current = data;
    // }

    // const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const deleteCategory = (categoryID: number) => {
      POST(DELETE_CATEGORY, {categoryID: categoryID}, (response: any) => {
        if(response.data.status == "ok"){
          setToast(
            <Row className="gap-3">
              <span>
                <CheckCircleFill color="#00FF00" />
              </span>
              Category deleted successfully!
            </Row>
          );
        }
      }, () => {});
    }

    // const [categoryNameEditable, setCategoryNameEditable] = useState(false);
    const renameCategory = (categoryID: number, name: string) => {
      POST(
        RENAME_CATEGORY,
        { categoryID: categoryID, name: name },
        (response: any) => {
          if (response.data.status == "ok") {
            // setCategoryNameEditable(false);
            setToast(
              <Row className="gap-3">
                <span>
                  <CheckCircleFill color="#00FF00" />
                </span>
                Category renamed successfully!
              </Row>
            );
            setSelectedCategory(null);
          }
        },
        () => {}
      );
    };

    const deleteModelImage = (modelID: number) => {
      POST(
        DELETE_MODEL_IMAGE, {modelID: modelID},
        (response: any) => {
          if (response.data.status == "ok") {
            setToast(
            <Row className="gap-3">
              <span><CheckCircleFill color="#00FF00"/></span>
              Model image deleted successfully!
            </Row>
            );
          }
        },
        () => {}
      );
    };

    // const changeSelectedModelImage = (data: any) => {
    //   POSTMedia(
    //     CHANGE_PAINTING,
    //     data,
    //     (response: any) => {
    //       if (response.data.status == "ok") {
    //         // setEditProductDialogBoxVisibleRef(false);
    //         setSelectedModelImage(null);
    //         setToast(
    //           <Row className="gap-3">
    //             <span>
    //               <CheckCircleFill color="#00FF00" />
    //             </span>
    //             {"Product " +
    //               (editProductDialogBoxVisibleRef.current
    //                 ? "Updated"
    //                 : "Added") +
    //               " Successfully!"}
    //           </Row>
    //         );
    //         const newImage = (
    //           document.getElementById(
    //             "product-change-image-field"
    //           ) as HTMLInputElement
    //         );
            
    //         newImage.files = null;
    //         newImage.value = "";
    //         setImageSelectedRef(false);
    //         setSelectedImage(null);
    //         // const timeout = setTimeout(() => {
    //         //   setProductAddUpdateStatusMessage(null);
    //         // }, 3000);
    //         // return () => clearTimeout(timeout);
    //       }
    //     },
    //     () => {}
    //   );
    // }

    // const uploadSuits = (data: any) => {
    //   POSTMedia(UPLOAD_SUITS, data, (response: any) => {
    //     if (response.data.status == "ok"){
    //       setToast(
    //         <Row className="gap-1">
    //           <span className="w-auto">
    //             <CheckCircleFill size={22} color="#00FF00" className="w-auto"/>
    //           </span>
    //           <span className="w-auto">Suits uploaded successfully!</span>
    //         </Row>
    //       );
    //     }
    //   }, () => {});
    // }

    const [variations, setVariations] = useState<Variation[]>();
    const getVariations = async () => {
      GET(
        "admin/product/variations",
        (response: any) => {
          setVariations(response.data.variations);
        },
        () => {}
      );
    };

    const deleteSize = async(id: number) => {
      POST("admin/size/delete", {sizeID: id}, () => {
        
      }, () => {

      })
    }

    const [selectedCategory, setSelectedCategory] = useState<Category|null>(null);
    const [selectedCategoryForFetchingData, setSelectedCategoryForFetchingData] = useState<Category | null>(null);
    // const [productToEdit, setProductToEdit] = useState<ModelImage|null>(null);

    const [addProduct, setAddProduct] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            getCategories();
            getStatuses();
            getRequests();
            getPreviewImages();
            getSizes();
            getVariations();

            setPendingRequests(0);
            requests?.forEach(request => {
                if (request.request_status == "Pending"){
                    setPendingRequests(oldValue => (oldValue + 1));
                }
            });

        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
      <>
        <Toast text={toast} />
        <Row
          className={
            (openWallImageUploadDialogBox ? "d-flex" : "d-none") +
            " justify-content-center align-items-center position-fixed top-0 start-0 vh-100 w-100"
          }
          style={{ zIndex: 100, backgroundColor: "#000A" }}
        >
          <Col xs={5} className="rounded-2 bg-white p-3">
            <Row className="fs-3 fw-bold ps-3">Add Image On The Wall</Row>
            <Row className="pt-3 px-4">
              <input
                type="file"
                className="form-control"
                multiple={true}
                onChange={(event) => {
                  const files = event.target.files;
                  if (files) {
                    setSelectedImagesOfTheWall(Array.from(files));
                  }
                }}
              />
            </Row>
            <Row className="pt-3 px-4 justify-content-end gap-3">
              <button
                className="btn btn-primary w-auto"
                onClick={() => {
                  const formData = new FormData();
                  if (selectedModelImage) {
                    formData.append(
                      "modelImageID",
                      selectedModelImage.imageID.toString()
                    );
                  }

                  selectedImagesOfTheWall.forEach((file) => {
                    formData.append("wallImages", file);
                  });
                  uploadImagesOnTheWall(formData);
                }}
              >
                UPLOAD
              </button>
              <button
                className="btn btn-danger w-auto"
                onClick={() => {
                  setOpenWallImageUploadDialogBox(false);
                }}
              >
                CLOSE
              </button>
            </Row>
          </Col>
        </Row>

        <Row className="py-5 pt-5 mt-4 vw-100 vh-100 overflow-y-scroll overflow-x-hidden">
          <TabContainer defaultActiveKey={"dashboard"}>
            <Row>
              <Col xs={2} style={{ backgroundColor: "#3300FF11" }}>
                <Nav
                  variant="pills"
                  defaultActiveKey={"dashboard"}
                  className="flex-column"
                >
                  <NavItem>
                    <NavLink eventKey="dashboard">Dashboard</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="requests">Requests</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="paints">Paints</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="preview-images">Preview Images</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="customization">Settings</NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col xs={10} className="ps-3">
                <TabContent>
                  <TabPane eventKey={"dashboard"}>
                    <Col xs={12}>
                      <Row className="gap-2">
                        <Card
                          className="admin-dashboard-card border-0"
                          style={{ width: "200px" }}
                        >
                          <CardHeader className="fs-5">
                            Total Requests
                          </CardHeader>
                          <CardBody className="fs-4 text-center">
                            {requests?.length}
                          </CardBody>
                        </Card>

                        <Card
                          className="admin-dashboard-card border-0"
                          style={{ width: "250px" }}
                        >
                          <CardHeader className="fs-5">
                            Peding Requests
                          </CardHeader>
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

                  <TabPane eventKey={"requests"}>
                    <Col xs={12} className="pt-3">
                      <ButtonGroup>
                        <ToggleButton
                          key={0}
                          id={`radio-all`}
                          type="radio"
                          name="status"
                          variant={
                            selectedStatusFilter === "All"
                              ? "primary"
                              : "outline-primary"
                          }
                          value={"All"}
                          checked={selectedStatusFilter === "All"}
                          onChange={() => setSelectedStatusFilter("All")}
                        >
                          All
                        </ToggleButton>
                        {statuses?.map((status, idx) => {
                          return (
                            <ToggleButton
                              key={idx}
                              id={`radio-${idx}`}
                              type="radio"
                              name="status"
                              variant={
                                selectedStatusFilter === status.status
                                  ? "primary"
                                  : "outline-primary"
                              }
                              value={`${status.status}`}
                              checked={selectedStatusFilter === status.status}
                              onChange={() =>
                                setSelectedStatusFilter(status.status)
                              }
                            >
                              {status.status}
                            </ToggleButton>
                          );
                        })}
                      </ButtonGroup>
                    </Col>
                    <Col xs={12} className="pt-3">
                      {requests?.map((request) => {
                        if (
                          request.request_status == selectedStatusFilter ||
                          selectedStatusFilter == "All"
                        ) {
                          const datetime = new Date(request.datetime);
                          return (
                            <Accordion>
                              <AccordionHeader
                                className=""
                                style={{ backgroundColor: "#0088FF33" }}
                              >
                                <Row className="w-100">
                                  <Col xs={6}>
                                    <span className="fs-5">
                                      {request.user.firstName}{" "}
                                      {request.user.lastName}
                                      's painting request
                                    </span>
                                  </Col>
                                  <Col xs={3} lg={2} className="d-flex gap-2">
                                    {request.request_status == "Complete" ? (
                                      <CheckCircle size={22} />
                                    ) : request.request_status == "Pending" ? (
                                      <ClockHistory size={22} />
                                    ) : (
                                      <></>
                                    )}
                                    {request.request_status}
                                  </Col>
                                  <Col
                                    xs={4}
                                    className="d-flex justify-content-end text-end text-black-50"
                                  >
                                    Created On{" "}
                                    {`${datetime.getMonth()}-${datetime.getDay()}-${datetime.getFullYear()}`}
                                  </Col>
                                </Row>
                              </AccordionHeader>
                              <AccordionBody>
                                <Row>
                                  <Col xs={12}>
                                    <Row>
                                      <span className="fs-4 fw-bold w-auto">
                                        {request.request_status}
                                      </span>
                                      {request.nextStatus ? (
                                        <button
                                          className="btn btn-success w-auto"
                                          onClick={() => {
                                            if (request?.nextStatus) {
                                              changeRequestStatus(
                                                request.id,
                                                request.nextStatus.id
                                              );
                                            }
                                          }}
                                        >
                                          Mark the Request as{" "}
                                          {request.nextStatus.status}
                                        </button>
                                      ) : (
                                        ""
                                      )}
                                    </Row>
                                    <Row className="pt-3">
                                      <Col xs={4}>
                                        <Row className="fs-4 fw-semibold ps-2">
                                          Image To be drawn
                                        </Row>
                                        <Row className="py-2">
                                          <img
                                            className="p-2"
                                            src={request.user_uploaded_image}
                                            style={{
                                              width: "300px",
                                              height: "400px",
                                              borderRadius: "20px",
                                            }}
                                          />
                                        </Row>
                                      </Col>
                                      <Col xs={4}>
                                        <Row className="fs-4 fw-semibold ps-2">
                                          Image to be like
                                        </Row>
                                        <Row className="py-2">
                                          <img
                                            className="p-2"
                                            src={request.model_image}
                                            style={{
                                              width: "300px",
                                              height: "400px",
                                              borderRadius: "20px",
                                            }}
                                          />
                                        </Row>
                                      </Col>
                                      <Col xs={4}>
                                        <Row className="fs-4 fw-semibold ps-2">
                                          Image preview
                                        </Row>
                                        <Row className="py-2">
                                          <img
                                            className="p-2"
                                            src={request.wall_image}
                                            style={{
                                              width: "300px",
                                              height: "400px",
                                              borderRadius: "20px",
                                            }}
                                          />
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </AccordionBody>
                            </Accordion>
                          );
                        }
                      })}
                    </Col>
                  </TabPane>

                  <TabPane eventKey={"paints"}>
                    <Row>
                      <Col
                        xs={12}
                        className={
                          (addProduct ? "d-flex" : "d-none") +
                          " w-100 flex-column"
                        }
                      >
                        <AddEditProduct
                          categories={categories}
                          selectedModelImage={selectedModelImage}
                          setAddProduct={setAddProduct}
                          variations={variations}
                          sizes={sizes}
                        />
                      </Col>
                      <Col
                        xs={12}
                        className={
                          (addProduct ? "d-none" : "d-flex") + " flex-column"
                        }
                      >
                        <Row className="rounded-2 top-form py-1">
                          <Col xs={4}>
                            <select
                              id="selected-category-for-preview"
                              className="form-select"
                              onClick={(event) => {
                                const selectedCategory = (
                                  event.target as HTMLInputElement
                                ).value;

                                let categorySelected = null;

                                categories?.forEach((category) => {
                                  if (category?.category == selectedCategory) {
                                    categorySelected = category;
                                    return;
                                  }
                                });

                                setSelectedCategoryForFetchingData(
                                  categorySelected
                                );
                              }}
                            >
                              {categories?.map((category) => {
                                return (
                                  <option value={category.category}>
                                    {category.category}
                                  </option>
                                );
                              })}
                            </select>
                          </Col>
                          <Col xs={3}>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                setAddProduct(true);
                              }}
                            >
                              Add a new product
                            </button>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} className="">
                            <table className="table table-striped">
                              <thead>
                                <th className="py-3">Product Image</th>
                                <th className="py-3">Product Name</th>
                                <th className="py-3">Product Variations</th>
                                <th className="py-3"></th>
                              </thead>
                              <tbody>
                                {selectedCategoryForFetchingData?.images.map(
                                  (image) => {
                                    return (
                                      <tr className="">
                                        <td className="d-flex justify-content-start">
                                          <img
                                            src={image.image}
                                            style={{
                                              width: "100px",
                                              height: "auto",
                                            }}
                                          />
                                        </td>
                                        <td className="paragraph">
                                          {image.productName}
                                        </td>
                                        <td className="">
                                          {/* <Row className="text-wrap overflow-x-scroll" style={{ width: "400px" }}>
                                            {JSON.stringify(image)}
                                          </Row> */}
                                          {image?.variations?.length
                                            ? image?.variations?.length
                                            : 0}{" "}
                                          Variations
                                          {/* {image?.variations?.map(
                                            (variation) => {
                                              return (
                                                <span className="d-block">
                                                  {variation?.variation?.variation}
                                                  <span className="d-block">
                                                    {variation?.sizes?.map(size => {
                                                      return <span className="d-inline-block">
                                                        <span className="d-block">
                                                          {size.sizeObj?.width}{size.sizeObj?.unit} x {size.sizeObj?.height}{size.sizeObj?.unit}
                                                        </span>
                                                        <span className="d-block">{size.price}</span>
                                                        </span>
                                                    })}
                                                  </span>
                                                </span>
                                              );
                                            }
                                          )} */}
                                        </td>
                                        <td className="">
                                          <div className="d-flex w-100 h-100 justify-content-end align-items-center">
                                            <button
                                              className="btn btn-outline-primary px-2 align-self-end"
                                              onClick={() => {
                                                setSelectedModelImage(image);
                                                // setProductToEdit(image);
                                                setAddProduct(true);
                                              }}
                                            >
                                              <PencilFill size={14} />
                                            </button>

                                            <button
                                              className="btn btn-outline-danger px-2 align-self-end"
                                              onClick={() => {
                                                deleteModelImage(image.imageID);
                                                // setProductToEdit(image);
                                                // setAddProduct(true);
                                              }}
                                            >
                                              <Trash size={14} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    {/* <Row>
                      <Col xs={2}>
                        <Row className="gap-3">
                          <Col xs={12} className="d-flex flex-column gap-1">
                            <Row
                              className="fs-6 fw-semibold ps-1 rounded-top-2"
                              style={{ backgroundColor: "#5500FF33" }}
                            >
                              Create a new category
                            </Row>
                            <Row>
                              <input
                                type="text"
                                className="form-control"
                                id="category-name-field"
                              />
                            </Row>
                            <Row>
                              <button
                                className="btn btn-primary"
                                onClick={createCategory}
                              >
                                Create
                              </button>
                            </Row>
                          </Col>

                          <Col xs={12} className="d-flex flex-column gap-1">
                            <Row
                              className="fs-6 fw-semibold ps-2 rounded-top-2 mb-1"
                              style={{ backgroundColor: "#5500FF33" }}
                            >
                              Add a new image
                            </Row>
                            <Row>
                              <select className="form-control" id="categories">
                                {categories?.map((category) => (
                                  <option value={category.id}>
                                    {category.category}
                                  </option>
                                ))}
                              </select>
                            </Row> */}
                    {/* <Row>
                              <input
                                type="file"
                                className="form-control"
                                onChange={(event) => {
                                  const files = event.target.files;
                                  if (files) {
                                    // setSelectedFiles(Array.from(files));
                                  }
                                }}
                              />
                            </Row> */}
                    {/* <Row>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  const selectedCategory = (
                                    document.getElementById(
                                      "categories"
                                    ) as HTMLInputElement
                                  ).value;

                                  if (selectedCategory) {
                                    setSelectedCategoryForNewImage(
                                      parseInt(selectedCategory)
                                    );
                                    setAddProductDialogVisibleRef(true);
                                    setEditProductDialogBoxVisibleRef(false);
                                  }

                                  // const productName = (
                                  //   document.getElementById(
                                  //     "product-name"
                                  //   ) as HTMLInputElement
                                  // ).value;
                                  // const formData = new FormData();
                                  // formData.append("productName", productName);
                                  // formData.append(
                                  //   "categoryID",
                                  //   selectedCategory
                                  // );

                                  // if (selectedFiles != null) {
                                  //   selectedFiles.forEach((file: File) => {
                                  //     formData.append("images", file);
                                  //   });
                                  // }
                                  // uploadModelImages(formData);
                                }}
                              >
                                Add Image
                              </button>
                            </Row>
                          </Col>

                          <Col xs={12}>
                            <Row
                              className="fs-6 fw-semibold ps-2 rounded-top-2 mb-1"
                              style={{ backgroundColor: "#5500FF33" }}
                            >
                              Add Suits
                            </Row>
                            <Row className="gap-2">
                              <input
                                type="file"
                                className="form-control"
                                multiple={true}
                                id="suits"
                              />
                              <button
                                className="btn btn-dark"
                                onClick={() => {
                                  const files = document.getElementById(
                                    "suits"
                                  ) as HTMLInputElement;
                                  if (files) {
                                    if (files.files && files.files.length > 0) {
                                      const formData = new FormData();
                                      for (
                                        let i = 0;
                                        i < files.files.length;
                                        i++
                                      ) {
                                        formData.append(
                                          "image-" + i,
                                          files.files[i]
                                        );
                                      }
                                      uploadSuits(formData);
                                    }
                                  }
                                }}
                              >
                                UPLOAD
                              </button>
                            </Row>
                          </Col>
                        </Row> */}
                    {/* <Row>
                          {showToast ? (
                            <span className="toast p-2 rounded-2">
                              {toastText}
                            </span>
                          ) : (
                            <></>
                          )}
                        </Row> */}
                    {/* </Col>
                      <Col xs={10} className="pt-3 ps-5">
                        {categories?.map((category) => (
                          <Accordion className="rounded-3">
                            <AccordionHeader className="">
                              <Row className="w-100">
                                <Col xs={6}>
                                  <span
                                    id={"category-name-" + category.id}
                                    className="fs-4 fw-semibold"
                                    contentEditable={categoryNameEditable}
                                    onKeyUp={(event) => {
                                      if (event.key == "Enter") {
                                        event.preventDefault();
                                        const element = document.getElementById(
                                          "category-name-" + category.id
                                        );
                                        if (element) {
                                          renameCategory(
                                            category.id,
                                            element.innerText
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    {category.category}
                                  </span>
                                </Col>
                                <Col
                                  xs={6}
                                  md={4}
                                  className="d-flex justify-content-end align-items-center pe-3 gap-2"
                                >
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                      setCategoryNameEditable(true);
                                    }}
                                  >
                                    Rename
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                      deleteCategory(category.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </Col>
                              </Row>
                            </AccordionHeader>
                            <AccordionBody className="d-flex flex-row ps-5 pt-3 ">
                              <Row className="gap-3 flex-nowrap overflow-x-auto overflow-y-hidden">
                                {category.images.map((image) => (
                                  <Card
                                    className="d-flex flex-column justify-content-start align-items-center image-card"
                                    style={{
                                      width: "200px",
                                      height: "300px",
                                      backgroundColor: "#EEEEEE",
                                      backgroundImage: `url('${image.image}')`,
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "center",
                                    }}
                                  >
                                    <Row
                                      style={{ height: "100%" }}
                                      className="w-100 justify-content-end align-items-center"
                                    >
                                      <Col
                                        xs={2}
                                        className="h-100 pe-2 me-2 pt-3 d-flex flex-column justify-content-start align-items-center"
                                      >
                                        <button
                                          className="tools-button"
                                          onClick={() => {
                                            deleteModelImage(image.imageID);
                                          }}
                                        >
                                          <TrashFill />
                                        </button>

                                        <button
                                          className="tools-button"
                                          onClick={() => {
                                            setSelectedModelImage(image);

                                            setAddProductDialogVisibleRef(
                                              false
                                            );
                                            setEditProductDialogBoxVisibleRef(
                                              true
                                            );
                                          }}
                                        >
                                          <PencilFill />
                                        </button>
                                      </Col>
                                    </Row>
                                    <Row
                                      className="pb-3 d-none align-items-end d-none"
                                      style={{ height: "50%" }}
                                    >
                                      <Col
                                        xs={12}
                                        className="d-flex justify-content-center align-items-end"
                                      >
                                        <button
                                          className="btn w-auto text-white add-a-preview-button"
                                          style={{ backgroundColor: "#80F" }}
                                          onClick={() => {
                                            setSelectedModelImage(image);
                                            setOpenWallImageUploadDialogBox(
                                              true
                                            );
                                          }}
                                        >
                                          Add a preview
                                        </button>
                                      </Col>
                                    </Row>
                                  </Card>
                                ))}
                              </Row>
                            </AccordionBody>
                          </Accordion>
                        ))}
                      </Col>
                    </Row> */}
                  </TabPane>
                  <TabPane eventKey={"preview-images"}>
                    <Row>
                      <Col
                        xs={12}
                        className="rounded-2 bg-white p-3 ps-5"
                        style={{ borderBottom: "2px solid #DDD" }}
                      >
                        <Row className="fs-6 fw-semibold ps-2 rounded-top-2">
                          <Col xs={12}>Add Preview Image</Col>
                        </Row>
                        <Row className="pt-1">
                          <Col xs={12} md={5} lg={4} xl={3}>
                            <input
                              type="file"
                              className="form-control"
                              multiple={true}
                              onChange={(event) => {
                                const files = event.target.files;
                                if (files) {
                                  setSelectedImagesOfTheWall(Array.from(files));
                                }
                              }}
                            />
                          </Col>
                          <Col xs={12} md={3} lg={2}>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                const formData = new FormData();
                                if (selectedModelImage) {
                                  formData.append(
                                    "modelImageID",
                                    selectedModelImage.imageID.toString()
                                  );
                                }

                                selectedImagesOfTheWall.forEach((file) => {
                                  formData.append("wallImages", file);
                                });
                                uploadImagesOnTheWall(formData);
                              }}
                            >
                              UPLOAD
                            </button>
                          </Col>
                        </Row>
                      </Col>
                      <Row className="gap-2 gap-md-3 justify-content-start pt-3 ps-5">
                        {previewImages?.map((image) => {
                          return (
                            <Card
                              style={{
                                width: "220px",
                                height: "205px",
                                backgroundRepeat: "no-repeat",
                                backgroundImage: `URL(${image.image})`,
                                backgroundSize: "contain",
                              }}
                              className="image-card"
                            >
                              {/* {image.image} */}
                              <Row
                                style={{ height: "100%" }}
                                className="w-100 justify-content-end align-items-center"
                              >
                                <Col
                                  xs={2}
                                  className="h-100 pt-3 d-flex flex-column justify-content-start align-items-center"
                                >
                                  <button
                                    style={{ backgroundColor: "#F00" }}
                                    className="tools-button"
                                    onClick={() => {
                                      deletePreviewImage(image.wallImageID);
                                    }}
                                  >
                                    <TrashFill />
                                  </button>
                                </Col>
                              </Row>
                            </Card>
                          );
                        })}
                      </Row>
                    </Row>
                  </TabPane>
                  <TabPane eventKey="customization">
                    <Row className="pt-4 px-5">
                      <TabContainer defaultActiveKey={"categories"}>
                        <Nav variant="underline">
                          <Nav.Item>
                            <Nav.Link eventKey={"categories"}>
                              Categories
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey={"sizes"}>Sizes</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey={"variations"}>
                              Product Variations
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey={"Pages-settings"}>
                              Pages settings
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>

                        <TabContent className="pt-4">
                          <TabPane eventKey={"categories"}>
                            <Row
                              className="pb-2"
                              style={{ borderBottom: "2px solid #DDD" }}
                            >
                              <Col xs={5} className="d-flex flex-column ps-0">
                                <input
                                  type="text"
                                  id="category-name-field"
                                  className="form-control"
                                  placeholder="New category name"
                                />
                              </Col>
                              <Col xs={3}>
                                <button
                                  className="btn btn-success"
                                  onClick={() => {
                                    createCategory();
                                  }}
                                >
                                  ADD
                                </button>
                              </Col>
                            </Row>
                            <Row className="gap-2 pt-2 justify-content-evenly h-100">
                              <Col
                                xs={12}
                                md={8}
                                className="pe-4"
                                style={{ borderRight: "2px solid #DDD" }}
                              >
                                <Row>
                                  <Col
                                    xs={12}
                                    className="d-flex flex-column gap-1"
                                  >
                                    {categories?.map((categoryItem) => {
                                      return (
                                        <Row
                                          className="px-2 py-3 rounded-2"
                                          style={{
                                            backgroundColor: selectedCategory
                                              ? categoryItem.id ==
                                                selectedCategory?.id
                                                ? "#5500FF10"
                                                : "#5500FF05"
                                              : "#5500FF05",
                                          }}
                                          onClick={() => {
                                            setSelectedCategory(categoryItem);
                                          }}
                                        >
                                          <Col xs={8}>
                                            {categoryItem.category}
                                          </Col>
                                          <Col
                                            xs={4}
                                            className="d-flex justify-content-end"
                                          >
                                            <button
                                              className="btn btn-outline-danger py-1 px-2 m-0"
                                              onClick={() => {
                                                deleteCategory(categoryItem.id);
                                                setSelectedCategory(null);
                                              }}
                                            >
                                              <Trash
                                                size={12}
                                                className="w-auto"
                                              />
                                            </button>
                                          </Col>
                                        </Row>
                                      );
                                    })}
                                  </Col>
                                </Row>
                              </Col>
                              <Col xs={12} md={3} className=" flex-grow-1 ps-4">
                                <Row className="pb-2">Category Name</Row>
                                <Row>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="edit-category-name"
                                    defaultValue={
                                      selectedCategory
                                        ? selectedCategory?.category
                                        : ""
                                    }
                                  />
                                </Row>
                                <Row className="justify-content-end pt-3">
                                  <button
                                    className="btn btn-primary w-auto"
                                    onClick={() => {
                                      const newCategoryName =
                                        document.getElementById(
                                          "edit-category-name"
                                        ) as HTMLInputElement;
                                      if (selectedCategory) {
                                        renameCategory(
                                          selectedCategory?.id,
                                          newCategoryName.value
                                        );
                                      }
                                    }}
                                  >
                                    Save Changes
                                  </button>
                                </Row>
                              </Col>
                            </Row>
                          </TabPane>

                          <TabPane eventKey={"sizes"}>
                            <Row
                              className="pb-2 px-2 pt-2 rounded-2"
                              style={{
                                borderBottom: "2px solid #DDD",
                                backgroundColor: "#5500FF10",
                              }}
                            >
                              <Col xs={3}>
                                <label htmlFor="painting-size">size</label>
                                <input
                                  id="painting-size"
                                  type="text"
                                  className="form-control"
                                />
                              </Col>
                              <Col xs={1}>
                                <label htmlFor="painting-width">width</label>
                                <input
                                  id="painting-width"
                                  type="number"
                                  className="form-control"
                                />
                              </Col>
                              <Col xs={1}>
                                <label htmlFor="painting-height">height</label>
                                <input
                                  id="painting-height"
                                  type="number"
                                  className="form-control"
                                />
                              </Col>
                              <Col xs={2}>
                                <label className="painting-size-unit">
                                  Unit
                                </label>
                                <select
                                  id="painting-size-unit"
                                  className=" form-select"
                                >
                                  <option value="cm">CM</option>
                                  <option value="ft">feet</option>
                                  <option value="inches">Inches</option>
                                </select>
                              </Col>
                              <Col xs={2}>
                                <label htmlFor="painting-price">Price</label>
                                <input
                                  type="number"
                                  id="painting-price"
                                  className=" form-control"
                                />
                              </Col>
                              <Col xs={2} className="d-flex align-items-end">
                                <button
                                  className="btn btn-success"
                                  onClick={() => {
                                    const size = (
                                      document.getElementById(
                                        "painting-size"
                                      ) as HTMLInputElement
                                    ).value;
                                    const width = (
                                      document.getElementById(
                                        "painting-width"
                                      ) as HTMLInputElement
                                    ).value;
                                    const height = (
                                      document.getElementById(
                                        "painting-height"
                                      ) as HTMLInputElement
                                    ).value;
                                    const unit = (
                                      document.getElementById(
                                        "painting-size-unit"
                                      ) as HTMLInputElement
                                    ).value;
                                    const price = (
                                      document.getElementById(
                                        "painting-price"
                                      ) as HTMLInputElement
                                    ).value;

                                    addSize(
                                      size ? size : "",
                                      parseFloat(width),
                                      parseFloat(height),
                                      unit,
                                      price ? parseFloat(price) : 0
                                    );
                                  }}
                                >
                                  ADD
                                </button>
                              </Col>
                            </Row>
                            <Row className="pt-2">
                              <Col
                                xs={8}
                                style={{ borderRight: "2px solid #DDD" }}
                              >
                                <table className="table table-striped table-hover">
                                  <thead>
                                    <tr>
                                      <th>Size</th>
                                      <th>Dimension</th>
                                      <th>Price</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sizes?.map((size) => {
                                      return (
                                        <tr>
                                          <td>{size.size}</td>
                                          <td>
                                            {size.width}
                                            {size.unit} x {size.height}
                                            {size.unit}
                                          </td>
                                          <td>${size.price}</td>
                                          <td>
                                            <button
                                              className="btn btn-outline-danger"
                                              onClick={() => {
                                                deleteSize(size.id);
                                              }}
                                            >
                                              <Trash />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </Col>
                            </Row>
                          </TabPane>

                          <TabPane eventKey={"variations"}>
                            <Variations variations={variations} />
                          </TabPane>

                          <TabPane eventKey="Pages-settings">
                            <PagesSettings />
                          </TabPane>

                          <TabPane>
                            <Row>
                              <Col
                                xs={12}
                                md={6}
                                lg={4}
                                className="rounded-2 px-3 py-2"
                                style={{ backgroundColor: "#BBAAFF33" }}
                              >
                                <Row className="px-3">
                                  <Col
                                    xs={6}
                                    md={8}
                                    xl={10}
                                    className="fs-3 fw-bold ps-0"
                                  >
                                    Paint Sizes
                                  </Col>
                                  <Col xs={6} md={4} xl={2} className="">
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => {
                                        setAddPaintingSizeDialogBoxVisibilityRef(
                                          true
                                        );
                                      }}
                                    >
                                      ADD
                                    </button>
                                  </Col>
                                </Row>
                                <Row className=" pt-2">
                                  <hr style={{ width: "100%" }} />
                                </Row>
                                <Row className="ps-4"></Row>
                              </Col>
                            </Row>
                          </TabPane>
                        </TabContent>
                      </TabContainer>
                    </Row>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </TabContainer>
        </Row>
      </>
    );
}