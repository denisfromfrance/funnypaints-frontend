import { ReactElement, useEffect, useState } from "react";
import { Category } from "../state/Types";
import { Card, Row } from "react-bootstrap";
import { GET_CATEGORIES_URL } from "../state/Constants";
import { GET } from "../utils/Utils";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Collection(props: any): ReactElement{
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>();
    const getCategories = async () => {
      GET(
        GET_CATEGORIES_URL,
        (response: any) => {
          if (response.data.status == "ok") {
            // setCategoryRequest(response.data);
            setCategories(response.data.categories);
            if (props.onReceiveCategories) {
              props.onReceiveCategories(response.data.categories);
            }
            console.log(response.data);
          }
        },
        (response: any) => {
          console.log(response.data.message);
        }
      );
    };

    useEffect(() => {
        getCategories();
    }, [props?.categories])
    return (
        <>
        <Row className="vh-100 vw-100 pt-5 mt-4">
            {categories?.map(category => {
                if (category.category == searchParams.get("category")){
                    return (
                      <>
                        {category.images.map((image) => {
                          return (
                            <Card
                              key={image.imageID + "-collection-" + image.categoryID}
                              style={{
                                color: "#FFF",
                                backgroundColor: "#EEEEEE",
                                backgroundImage: `url(${image.image})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundClip: "padding-box",
                                cursor: "pointer",
                              }}
                              className="d-flex flex-column justify-content-end pb-2 product-card"
                              onClick={() => {
                                navigate(
                                  `/order-an-art?category=${category.category}&product=${image?.imageID}`
                                );
                              }}
                            ></Card>
                          );
                        })}
                      </>
                    );
                }else{
                    return <></>
                }
            })}
        </Row>
        </>
    );
}