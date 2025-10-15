import { ReactElement, useEffect, useState } from "react";
import { Category, ModelImage, ProductVariation, Size, Variation } from "../../../state/Types";
import { Col, Row } from "react-bootstrap";
import { Folder, PlusCircleFill } from "react-bootstrap-icons";
import { POSTMedia } from "../../../utils/Utils";
import { CHANGE_PAINTING } from "../../../state/Constants";

type ProductDataStructure = {
  categoryID?: number,
  name?: string,
  image?: File,
  variations?: ProductVariation[]
}

type ProductInformationRequest = {
  modelImageID?: number;
  categoryID?: number;
  name?: string;
  image?: File;
  variations?: string;
};


export default function AddEditProduct(props: {categories: Category[], setAddProduct: CallableFunction, selectedModelImage: ModelImage | null | undefined, variations: Variation[] | undefined, sizes: Size[] | undefined}): ReactElement{
    const [selectedImage, setSelectedImage] = useState<String|null>();
    const [variations, setVariations] = useState<Variation[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variation | null | undefined>();

    const [currentProductVariations, setCurrentProductVariations] = useState<ProductVariation[]>([]);

    const [productInformation, setProductInformation] = useState<ProductDataStructure>({
      name: "",
      variations: [],
    });

    useEffect(() => {
      if (props?.selectedModelImage) {
        setCurrentProductVariations(props?.selectedModelImage.variations);
        console.log(props?.selectedModelImage.variations);
      }
    }, [props?.selectedModelImage]);

    return (
      <>
        <Row className="d-flex flex-row gap-2 top-form py-2 pe-3">
          <Col xs={3}>
            <select className="w-auto form-select" id="product-category">
              <option>--Select product category --</option>
              {props?.categories?.map((category) => {
                return <option value={category.id} selected={props?.selectedModelImage?.categoryID == category.id}>{category.category}</option>;
              })}
            </select>
          </Col>
          <Col xs={3}>
            <input
              type="text"
              id="product-name"
              placeholder="Product Name"
              defaultValue={props?.selectedModelImage?.productName}
              className="form-control w-auto"
            />
          </Col>
          <Col xs={5} className="flex-grow-1">
            <Row className="justify-content-end gap-3">
              <button
                className="btn btn-primary w-auto"
                onClick={() => {
                  const images = (
                    document.getElementById(
                      "product-image-field"
                    ) as HTMLInputElement
                  ).files;

                  const name = (
                    document.getElementById("product-name") as HTMLInputElement
                  ).value;

                  const category = parseInt((document.getElementById("product-category")  as HTMLSelectElement).value);

                  const product = productInformation;
                  product.name = name;

                  product.categoryID = category;
                  
                  if (images && images.length > 0) {
                    product.image = images[0];
                  }

                  setProductInformation(product);

                  const productRequest: ProductInformationRequest = {
                    name: product.name,
                    image: product.image,
                    variations: JSON.stringify(currentProductVariations)
                  }

                  if (props?.selectedModelImage) {
                    productRequest.modelImageID = props?.selectedModelImage.imageID;
                  } else {
                    productRequest.categoryID = product.categoryID;
                  }

                  console.log(productRequest);

                  POSTMedia(CHANGE_PAINTING, productRequest, () => {
                    alert("Product Registered Successfully!");
                  }, () => {});
                }}
              >
                Save
              </button>
              <button
                className="btn btn-danger w-auto"
                onClick={() => {
                  setCurrentProductVariations([]);
                  setProductInformation({})
                  setVariations([]);
                  setSelectedImage(null);
                  props.setAddProduct(false);
                }}
              >
                CLOSE
              </button>
            </Row>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col xs={6}>
            <label
              id="product-image-field-label"
              htmlFor="product-image-field"
              className=" d-flex w-100 h-100 justify-content-center align-items-center rounded-2"
              style={{
                backgroundColor: "#DDD",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                cursor: "pointer",
                backgroundPosition: "center",
                backgroundImage: `url(${
                  props.selectedModelImage
                    ? props.selectedModelImage?.image
                    : selectedImage
                    ? selectedImage
                    : ""
                })`,
              }}
            >
              {!props.selectedModelImage && !selectedImage ? (
                <>
                  <div className="pe-3">
                    <Folder size={42} />
                  </div>
                  <div className="">Click Here to select an image</div>
                </>
              ) : (
                ""
              )}
            </label>
            <input
              type="file"
              id="product-image-field"
              multiple={false}
              hidden={true}
              onChange={(event) => {
                const files = event.target.files;
                if (files) {
                  setSelectedImage(URL.createObjectURL(files[0]));
                }
              }}
            />
          </Col>
          <Col xs={6}>
            <Row>
              <Col xs={8}>
                <select
                  id="product-variation"
                  className="form-select"
                  onChange={(event) => {
                    {
                      const value = parseInt(
                        (event.target as HTMLSelectElement).value
                      );
                      props?.variations?.forEach((variation) => {
                        if (value == variation.id) {
                          setSelectedVariant(variation);
                        }
                      });
                    }
                  }}
                >
                  <option>-- select variant --</option>
                  {props?.variations?.map((variation) => {
                    return (
                      <option value={variation.id}>
                        {variation.variation}
                      </option>
                    );
                  })}
                </select>
              </Col>
              <Col xs={4} className="d-flex align-items-center">
                <span
                  className="text-primary d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const newList: Variation[] = [...variations];
                    if (selectedVariant) {
                      newList.push(selectedVariant);
                    }
                    setVariations(newList);

                    let foundVariation = false;
                    currentProductVariations?.forEach((ov) => {
                      if (ov.variation?.id == selectedVariant?.id) {
                        foundVariation = true;
                        return;
                      }
                    });

                    if (!foundVariation) {
                      const newProductVariation: ProductVariation = {
                        variation: selectedVariant,
                        sizes: [],
                      };
                      const newVariationList = currentProductVariations;
                      newVariationList?.push(newProductVariation);
                      setCurrentProductVariations(newVariationList);
                    }

                    setSelectedVariant(null);
                  }}
                >
                  <PlusCircleFill /> Add New Variation
                </span>
              </Col>
            </Row>
            <Row className="gap-2 pt-1">
              {currentProductVariations?.map((variation, i) => {
                return (
                  <Col
                    xs={12}
                    style={{ backgroundColor: "#5500FF0F" }}
                    className="border border-1 rounded-2 py-2"
                  >
                    <Row className="fw-semibold ps-0 pb-0">
                      <Col xs={12}>{variation?.variation?.variation}</Col>
                      <Col xs={8}>
                        <select
                          className=" form-select"
                          id={`${variation.variation?.variation}-size`}
                        >
                          {props?.sizes?.map((size, si) => {
                            return (
                              <option value={`${size.id}-${si}`}>
                                {size.size} ({size.width}x{size.height})
                              </option>
                            );
                          })}
                        </select>
                      </Col>
                      <Col xs={3}>
                        <span
                          className=" text-success d-flex align-items-center gap-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const productInformation = currentProductVariations;
                            const sizeSelector = document.getElementById(
                              `${variation.variation?.variation}-size`
                            ) as HTMLSelectElement;
                            const [id, index] = sizeSelector.value.split("-");
                            productInformation[i].sizes?.push({
                              id: parseInt(id),
                              price: 0,
                              sizeObj: props.sizes ? props.sizes[parseInt(index)] : null
                            });
                            setCurrentProductVariations(productInformation);
                          }}
                        >
                          <PlusCircleFill />
                          New Size
                        </span>
                      </Col>
                    </Row>
                    <Row className="">
                      {variation?.sizes?.map((size, si) => {
                        const label = size?.sizeObj?.size
                          ? size.sizeObj.size
                          : `${size?.sizeObj?.width}${size?.sizeObj?.unit}x${size?.sizeObj?.height}${size?.sizeObj?.unit}`;
                        return (
                          <Col xs={4}>

                            <label htmlFor="product-change-small-size">
                              {label}
                            </label>
                            <input
                              id="product-change-small-size"
                              type="number"
                              defaultValue={size.price}
                              onKeyUp={(event) => {
                                const target = event.target as HTMLInputElement;
                                const value = target.value;
                                const p = currentProductVariations;
                                const sizes = p[i].sizes?.map((s, i) => {
                                  const ns = s;
                                  if (si == i) {
                                    ns.price = parseFloat(value);
                                  }
                                  return ns;
                                });
                                p[i].sizes = sizes;
                                setCurrentProductVariations(p);
                              }}
                              className="form-control"
                            />
                          </Col>
                        );
                      }, [])}
                    </Row>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </>
    );
}