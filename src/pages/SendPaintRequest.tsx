import { Card, Col, Row } from "react-bootstrap";
import {useState, type ReactElement, useEffect} from "react";
import { Category, ModelImage, Suit, WallImage } from "../state/Types";
import { GET, POSTMedia } from "../utils/Utils";
import { GET_CATEGORIES_URL, GET_WALL_IMAGES_URL, GET_SUITS, ADD_ITEMS_TO_THE_CART } from "../state/Constants";

import "./css/style.css";
import { useSearchParams } from "react-router-dom";
import { Cart4 } from "react-bootstrap-icons";

type SelectedProductInformation = {
  variantIDs: {variantID: number, sizes: number[]}[]
}

export default function SendPaintRequest(): ReactElement{
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedModelImage, setSelectedModelImage] = useState<ModelImage>();

  const [selectedProductInformation, setSelectedProductInformation] = useState<SelectedProductInformation>({variantIDs: []});

  const [imagePreviewScale, setImagePreviewScale] = useState<number>(0.9);
  const [modelPreviewImageYPosition, setModelPreviewImageYPosition] = useState<number>(0);

  const [firstImageList, setFirstImageList] = useState<WallImage[]>([]);
  const [secondImageList, setSecondImageList] = useState<WallImage[]>([]);

  const [imageSize, setImageSize] = useState<{width: number, height: number} | null>(null);

  // const [categoryRequest, setCategoryRequest] = useState<CategoryRequest>();

  const [selectedWallImage, setSelectedWallImage] = useState<WallImage>();
  const [selectedWallImageID, setSelectedWallImageID] = useState<Number>();
  const [userSelectedImage, setUserSelectedImage] = useState<File>();

  const getCategories = async() => {
      GET(GET_CATEGORIES_URL, (response: any) => {
          if (response.data.status == "ok"){
              // setCategoryRequest(response.data);
              setCategories(response.data.categories);
              response.data.categories?.forEach((value: Category) => {
                const category = searchParams.get("category");
                if (category === value.category) {
                  setSelectedCategory(value);
                  value.images.map(image => {
                    const productID = searchParams.get("product");
                    if(productID){
                      if(parseInt(productID) == image.imageID){
                        setSelectedModelImage(image);
                      }
                    }
                  });
                }
              });
              console.log(response.data);
          }
      }, (response: any) => {
          console.log(response.data.message);
      });
  }


  const [_, setWallImages] = useState<WallImage[]>([]);
  const getWallImages = async() => {
      GET(GET_WALL_IMAGES_URL, (response: any) => {
          const data = response.data;
          setWallImages(data.wallImages);
          setFirstImageList(data.wallImages.slice(0, 6));
          setSecondImageList(data.wallImages.slice(6));
      }, (response: any) => {
          console.log(response);
      })
  }

  // const [selectedSize, setSelectedSize] = useState<Size | null>();
  
  // const [selectedSize, setSelectedSize] = useState<{
  //   size: string;
  //   price: number | undefined;
  // } | null>();

  // const [sizes, setSizes] = useState<Size[]>();

  // const [sizes, setSizes] = useState<{size: string, price: number | undefined}[]>();
  // const getSizes = () => {
  //   GET(
  //     GET_SIZES_URL,
  //     (response: any) => {
  //       setSizes(response.data.sizes);
  //     },
  //     () => {}
  //   );
  // };

  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const addToCart = async(modelImage: Number, wallImage: Number, userSelectedImage: File) => {
    const formData = new FormData();
      formData.append("modelImage", modelImage.toString());
      formData.append("wallImage", wallImage.toString());
      formData.append("userSelectedImage", userSelectedImage);
      formData.append("variantInformation", JSON.stringify(selectedProductInformation));
      POSTMedia(ADD_ITEMS_TO_THE_CART, formData, (request: any) => {
          if (request.data.status == "ok"){
            setAddedToCart(true);
            alert("Request made successfully!");
          }
      }, (request: any) => {
          console.log(request.message);
      })
  }

  const [suits, setSuits] = useState<Suit[]>([]);
  const getSuits = async() => {
    GET(GET_SUITS, (response: any) => {
      if (response.data.status == "ok"){
        setSuits(response.data?.suits)
      }
    }, () => {});
  }

  // const sendPaintRequest = (modelImage: Number, wallImage: Number, userSelectedImage: File) => {
  //     const formData = new FormData();
  //     formData.append("modelImage", modelImage.toString());
  //     formData.append("wallImage", wallImage.toString());
  //     formData.append("userSelectedImage", userSelectedImage);
  //     POSTMedia(REQUEST_ART_URL, formData, (request: any) => {
  //         if (request.data.status == "ok"){
  //             alert("Request made successfully!");
  //         }
  //     }, (request: any) => {
  //         console.log(request.message);
  //     })
  // }  

  useEffect(() => {
    console.log(selectedCategory);
    setImagePreviewScale(0.9);
  }, []);

  useEffect(() => {
      const interval = setInterval(() => {
          getCategories();
          getWallImages();
          // getSizes();
          getSuits();
      }, 2000);

      console.log(categories);

      return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Row className="h-100 py-5 mt-5 justify-content-center gap-5">
        <Col xs={5}>
          <Row>
            <Col xs={3} md={2} className="">
              <Row className="flex-column gap-2">
                {firstImageList?.map((wallImage) => {
                  if (!imageSize) {
                    const image = new Image();
                    image.src = wallImage.image;
                    image.onload = () => {
                      const maxWidth = 125;
                      const scale =
                        image.width > maxWidth ? maxWidth / image.width : 1;
                      wallImage.width = image.width * scale;
                      wallImage.height = image.height * scale;
                      setImageSize({
                        width: image.width * scale,
                        height: image.height * scale,
                      });
                      // alert(size);
                    };
                  }

                  let smallImagePositionY = 0;

                  if (wallImage.wallImageID == 1) {
                    smallImagePositionY = 12;
                  } else if (wallImage.wallImageID == 2) {
                    smallImagePositionY = 8;
                  } else if (wallImage.wallImageID == 3) {
                    smallImagePositionY = 15;
                  } else if (wallImage.wallImageID == 4) {
                    smallImagePositionY = 15;
                  } else if (wallImage.wallImageID == 5) {
                    smallImagePositionY = 20;
                  } else if (wallImage.wallImageID == 6) {
                    smallImagePositionY = 16;
                  }

                  return (
                    // <Col xs={5} md={4} lg={2}>
                    <Card
                      className="d-flex flex-column align-items-center justify-content-center p-0"
                      style={{
                        width: `${imageSize?.width}px`,
                        height: `${imageSize?.height}px`,
                        backgroundImage: `url('${wallImage.image}')`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        border:
                          selectedWallImageID == wallImage.wallImageID
                            ? "3px solid #0088FF"
                            : "",
                      }}
                      onClick={() => {
                        const id = wallImage.wallImageID;

                        if (id == 1) {
                          setModelPreviewImageYPosition(52);
                        } else if (id == 2) {
                          setModelPreviewImageYPosition(38);
                        } else if (id == 3) {
                          setModelPreviewImageYPosition(70);
                        } else if (id == 4) {
                          setModelPreviewImageYPosition(50);
                        } else if (id == 5) {
                          setModelPreviewImageYPosition(120);
                        } else if (id == 6) {
                          setModelPreviewImageYPosition(80);
                        }
                        setSelectedWallImage(wallImage);
                        setSelectedWallImageID(wallImage.wallImageID);
                      }}
                    >
                      {selectedWallImageID == wallImage.wallImageID ? (
                        <svg
                          viewBox="0 0 50 50"
                          style={{ width: "50px", height: "50px" }}
                          className="position-absolute top-0 end-0"
                        >
                          <path d="M0,0 50,0 50,50 Z" fill="#0088FF" />
                          <path
                            d="M24,12 30,18 42,6"
                            fill="transparent"
                            stroke="#FFF"
                            strokeLinecap="round"
                            strokeWidth={3}
                          />
                        </svg>
                      ) : (
                        <></>
                      )}
                      <Card
                        className="position-relative"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                          backgroundImage: `url(${selectedModelImage?.image})`,
                          backgroundSize: "15px auto",
                          backgroundPosition: `center calc(50% - ${smallImagePositionY}px)`,
                          backgroundRepeat: "no-repeat",
                        }}
                      ></Card>
                    </Card>
                    // </Col>
                  );
                })}
              </Row>
            </Col>
            <Col xs={9} md={10} className="d-flex flex-column ps-4 pe-0">
              <Row
                className="position-relative justify-content-center align-items-center"
                style={{
                  width: `${580 * imagePreviewScale}px`,
                  height: `${495 * imagePreviewScale}px`,
                  // transform: `scale(${imagePreviewScale})`,
                  backgroundImage: selectedWallImage?.image
                    ? `url('${selectedWallImage?.image}')`
                    : "rgba(50, 50, 50, 1.0)",
                  backgroundColor: "#CCCCCC",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${540 * imagePreviewScale}px ${
                    495 * imagePreviewScale
                  }px`,
                  backgroundPosition: "center",
                }}
              >
                {!selectedWallImage?.image ? (
                  <svg
                    viewBox="0 0 500 400"
                    className="position-absolute top-0 start-0 w-100 h-100"
                    preserveAspectRatio="XMidyMid slice"
                  >
                    <rect
                      x={"175"}
                      width={"150"}
                      y={"150"}
                      height={"100"}
                      stroke="#888"
                      strokeWidth={5}
                      rx={10}
                      ry={10}
                      fill="transparent"
                    />
                    <path
                      d="M185,230 L215,200 255,230"
                      stroke="#888"
                      fill="transparent"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <path
                      d="M227,208 L235,200 275,230"
                      stroke="#888"
                      fill="transparent"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <path
                      d="M270,220 L315,220"
                      stroke="#888"
                      fill="transparent"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <circle
                      cx={290}
                      cy={195}
                      r={8}
                      stroke="transparent"
                      fill="#888"
                    />
                  </svg>
                ) : (
                  <Card
                    className="position-relative"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "transparent",
                      backgroundImage: `url(${selectedModelImage?.image})`,
                      backgroundSize: "90px auto",
                      backgroundPosition: `center calc(50% - ${modelPreviewImageYPosition}px)`,
                      backgroundRepeat: "no-repeat",
                    }}
                  ></Card>
                )}
              </Row>
              <Row className="gap-2 pt-2">
                {secondImageList?.map((wallImage) => {
                  if (!imageSize) {
                    const image = new Image();
                    image.src = wallImage.image;
                    image.onload = () => {
                      const maxWidth = 125;
                      const scale =
                        image.width > maxWidth ? maxWidth / image.width : 1;
                      wallImage.width = image.width * scale;
                      wallImage.height = image.height * scale;
                      setImageSize({
                        width: image.width * scale,
                        height: image.height * scale,
                      });
                      // alert(size);
                    };
                  }

                  let smallImagePositionY = 0;

                  if (wallImage.wallImageID == 1) {
                    smallImagePositionY = 12;
                  } else if (wallImage.wallImageID == 2) {
                    smallImagePositionY = 8;
                  } else if (wallImage.wallImageID == 3) {
                    smallImagePositionY = 15;
                  } else if (wallImage.wallImageID == 4) {
                    smallImagePositionY = 15;
                  } else if (wallImage.wallImageID == 5) {
                    smallImagePositionY = 20;
                  } else if (wallImage.wallImageID == 6) {
                    smallImagePositionY = 16;
                  }

                  return (
                    // <Col xs={5} md={4} lg={2}>
                    <Card
                      className="d-flex flex-column align-items-center justify-content-center p-0"
                      style={{
                        width: `${imageSize?.width}px`,
                        height: `${imageSize?.height}px`,
                        backgroundImage: `url('${wallImage.image}')`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        border:
                          selectedWallImageID == wallImage.wallImageID
                            ? "3px solid #0088FF"
                            : "",
                      }}
                      onClick={() => {
                        const id = wallImage.wallImageID;
                        if (id == 7) {
                          setModelPreviewImageYPosition(52);
                        } else if (id == 8) {
                          setModelPreviewImageYPosition(48);
                        } else if (id == 9) {
                          setModelPreviewImageYPosition(70);
                        } else if (id == 10) {
                          setModelPreviewImageYPosition(50);
                        }
                        setSelectedWallImage(wallImage);
                        setSelectedWallImageID(wallImage.wallImageID);
                      }}
                    >
                      {selectedWallImageID == wallImage.wallImageID ? (
                        <svg
                          viewBox="0 0 50 50"
                          style={{ width: "50px", height: "50px" }}
                          className="position-absolute top-0 end-0"
                        >
                          <path d="M0,0 50,0 50,50 Z" fill="#0088FF" />
                          <path
                            d="M24,12 30,18 42,6"
                            fill="transparent"
                            stroke="#FFF"
                            strokeLinecap="round"
                            strokeWidth={3}
                          />
                        </svg>
                      ) : (
                        <></>
                      )}
                      <Card
                        className="position-relative"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                          backgroundImage: `url(${selectedModelImage?.image})`,
                          backgroundSize: "15px auto",
                          backgroundPosition: `center calc(50% - ${smallImagePositionY}px)`,
                          backgroundRepeat: "no-repeat",
                        }}
                      ></Card>
                    </Card>
                    // </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className="pt-4">
              <Row className="gap-3">
                {/* {selectedCategory?.images.map((image) => (
                <Card
                  className="position-relative"
                  style={{
                    width: "160px",
                    height: "200px",
                    backgroundColor: "#EEEEEE",
                    backgroundImage: `url('${image.image}')`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    border:
                      selectedModelImage == image ? "3px solid #0088FF" : "",
                  }}
                  onClick={() => {
                    setSelectedModelImage(image);
                  }}
                >
                  {selectedModelImage == image ? (
                    <svg
                      viewBox="0 0 50 50"
                      style={{ width: "50px", height: "50px" }}
                      className="position-absolute top-0 end-0"
                    >
                      <path d="M0,0 50,0 50,50 Z" fill="#0088FF" />
                      <path
                        d="M24,12 30,18 42,6"
                        fill="transparent"
                        stroke="#FFF"
                        strokeLinecap="round"
                        strokeWidth={3}
                      />
                    </svg>
                  ) : (
                    <></>
                  )}
                </Card>
              ))} */}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={6}>
          <Row>
            The animal you see in the image will get replaced with the animal
            image or images you choose.
          </Row>
          <Row className="gap-3 pt-3">
            <Col xs={4}>
              <Row>
                <input
                  type="file"
                  className="form-control"
                  placeholder="Select an image"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files != null && files.length > 0) {
                      const file = files[0];
                      setUserSelectedImage(file);
                    }
                  }}
                />
              </Row>
            </Col>
            {/* <Col xs={4}>
              <Row>
                 <select
                className="form-select"
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  // categories?.forEach((value) => {
                  //   if (parseInt(selectedValue) === value.id) {
                  //     setSelectedCategory(value);
                  //   }
                  // });

                  if (selectedValue == "paint-on-canvas") {
                    setSizes([
                      {
                        size: "small",
                        price: selectedModelImage?.smallPaintOnCanvasSize,
                      },
                      {
                        size: "medium",
                        price: selectedModelImage?.mediumPaintOnCanvasSize,
                      },
                      {
                        size: "large",
                        price: selectedModelImage?.largePaintOnCanvasSize,
                      },
                    ]);
                  } else if (selectedValue == "print-on-canvas") {
                    setSizes([
                      {
                        size: "small",
                        price: selectedModelImage?.smallSize,
                      },
                      {
                        size: "medium",
                        price: selectedModelImage?.mediumSize,
                      },
                      {
                        size: "large",
                        price: selectedModelImage?.largeSize,
                      },
                    ]);
                  } else if (selectedValue == "print-on-metal") {
                    setSizes([
                      {
                        size: "small",
                        price: selectedModelImage?.smallPrintMetalSize,
                      },
                      {
                        size: "medium",
                        price: selectedModelImage?.mediumPrintMetalSize,
                      },
                      {
                        size: "large",
                        price: selectedModelImage?.largePrintMetalSize,
                      },
                    ]);
                  } else if (selectedValue == "print-on-paper") {
                    setSizes([
                      {
                        size: "small",
                        price: selectedModelImage?.smallPrintPaperSize,
                      },
                      {
                        size: "medium",
                        price: selectedModelImage?.mediumPrintPaperSize,
                      },
                      {
                        size: "large",
                        price: selectedModelImage?.largePrintPaperSize,
                      },
                    ]);
                  }
                }}
              >
                <option>Select the category</option>
                {selectedModelImage?.variations.map((variation) => {
                  return <option>{variation.variation?.variation}</option>
                })}
              </select>
              </Row>
            </Col>
            */}
            <Col xs={6} className="d-flex gap-2">
              <button
                className="btn btn-primary"
                disabled={
                  selectedModelImage && selectedWallImage && userSelectedImage
                    ? false
                    : true
                }
                onClick={() => {
                  if (
                    selectedModelImage &&
                    selectedWallImage &&
                    userSelectedImage &&
                    selectedProductInformation?.variantIDs.length > 0
                  ) {
                    // sendPaintRequest(
                    //   selectedModelImage?.imageID,
                    //   selectedWallImage?.wallImageID,
                    //   userSelectedImage
                    // );

                    addToCart(
                      selectedModelImage.imageID,
                      selectedWallImage.wallImageID,
                      userSelectedImage
                    );
                  } else {
                    alert(userSelectedImage);
                  }
                }}
              >
                Place The Order
              </button>
              {addedToCart ?
              <a href="/cart" className="w-auto">
                <button className="btn btn-success">
                  <Cart4 /> View Cart
                </button>
              </a>
              : <></>}
            </Col>
          </Row>
          <Row
            className="ps-3 mt-4 mb-2 w-auto rounded-2 py-1 justify-content-start align-items-center text-center"
            style={{ backgroundColor: "#8822FF22" }}
          >
            Pick the size. (Price may vary depending on the size)
          </Row>
          <Row className="gap-3">
            {selectedModelImage?.variations?.map((variation) => {
              const sizes: number[] = [];

              selectedProductInformation.variantIDs.forEach((v) => {
                sizes.push(...v.sizes);
              });

              return (
                <>
                  <span
                    className="product-variation-data-container"
                    onClick={(event) => {
                      const element = event.currentTarget as HTMLElement;
                      if (element.classList.contains("show")) {
                        element.classList.remove("show");
                      } else {
                        element.classList.add("show");
                      }
                    }}
                  >
                    <span className="d-block heading-5">
                      {variation ? variation.variation?.variation : ""}
                    </span>
                    <span className="d-flex gap-2 py-3">
                      {variation ? (
                        variation.sizes?.map((size) => {
                          return (
                            <span
                              className="d-flex rounded-2 justify-content-center align-items-center heading-5 px-3"
                              style={{
                                width: "auto",
                                height: "50px",
                                backgroundColor: "#2200ff33",
                                border: size?.id
                                  ? sizes.includes(size?.id)
                                    ? "solid 2px #000"
                                    : "none"
                                  : "none",
                              }}
                              onClick={() => {
                                const updatedProductInformation =
                                  selectedProductInformation;
                                let foundVariantInformation = false;
                                let foundSize = false;
                                updatedProductInformation.variantIDs.forEach(
                                  (variantInformation: {
                                    variantID: number;
                                    sizes: number[];
                                  }) => {
                                    if (
                                      variantInformation.variantID ==
                                      variation.variation?.id
                                    ) {
                                      foundVariantInformation = true;
                                      variantInformation.sizes.forEach(
                                        (sizeID) => {
                                          if (sizeID == size.id) {
                                            foundSize = true;
                                          }
                                        }
                                      );
                                      return;
                                    }
                                  }
                                );

                                if (!foundVariantInformation) {
                                  if (variation.variation?.id && size) {
                                    const sizes: number[] = [];
                                    if (size?.id) {
                                      sizes.push(size.id);
                                    }
                                    updatedProductInformation.variantIDs.push({
                                      variantID: variation.variation?.id,
                                      sizes: sizes,
                                    });
                                  }
                                } else {
                                  if (foundSize) {
                                    let newVariationIDs: {
                                      variantID: number;
                                      sizes: number[];
                                    }[] = [];
                                    updatedProductInformation.variantIDs.forEach(
                                      (element) => {
                                        const newSizes: number[] = [];
                                        element.sizes.forEach((s) => {
                                          if (s != size.id) {
                                            return newSizes.push(s);
                                          }
                                        });

                                        if (newSizes.length != 0) {
                                          element.sizes = newSizes;
                                          newVariationIDs.push(element);
                                        }
                                      }
                                    );

                                    updatedProductInformation.variantIDs =
                                      newVariationIDs;
                                  } else {
                                    updatedProductInformation.variantIDs.forEach(
                                      (element) => {
                                        if (
                                          variation.variation?.id ==
                                          element.variantID
                                        ) {
                                          if (size?.id) {
                                            element.sizes.push(size.id);
                                          }
                                        }
                                      }
                                    );
                                  }
                                }
                                setSelectedProductInformation(
                                  updatedProductInformation
                                );
                                console.log(updatedProductInformation);
                              }}
                            >
                              {size.sizeObj?.width}
                              {size.sizeObj?.unit}x{size.sizeObj?.height}
                              {size.sizeObj?.unit}
                            </span>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </span>
                  </span>
                </>
              );
            })}
          </Row>
          <Row className=" pt-2 pb-3">
            {/* {sizes?.map((size) => {
              return (
                <Card
                  className=""
                  style={{
                    width: "200px",
                    border:
                      selectedSize?.size == size.size
                        ? "solid 3px #0055FF"
                        : "",
                  }}
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                >
                  <CardHeader className="justify-content-center text-center">
                    <Row>
                      <Col xs={6}>{size.size}</Col>
                      <Col xs={6}>${size.price}</Col>
                    </Row>
                  </CardHeader>
                </Card>
              );
            })} */}

            {/* {sizes?.map((size) => {
            return (
              <Card
                className=""
                style={{
                  width: "200px",
                  border:
                    selectedSize?.id == size.id ? "solid 3px #0055FF" : "",
                }}
                onClick={() => {
                  setSelectedSize(size);
                }}
              >
                <CardHeader className="justify-content-center text-center">
                  <Row>
                    <Col xs={6}>{size.size}</Col>
                    <Col xs={6}>${size.price}</Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row className="text-center justify-content-center">
                    {size.width}
                    {size.unit} x {size.height}
                    {size.unit}
                  </Row>
                </CardBody>
              </Card>
            );
          })} */}
          </Row>
        </Col>
        <Col xs={12} className="px-2 px-md-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8}>
              <Row className="pb-2">
                Select the suitable suit for your animal
              </Row>
              <Row className="flex-wrap gap-3">
                {suits?.map((suit) => {
                  return (
                    <Card
                      style={{
                        width: "120px",
                        height: "120px",
                        backgroundImage: `url(${suit.suitImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></Card>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}