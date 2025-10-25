import {useState, type ReactElement, useEffect} from "react";
import { Row, Col } from "react-bootstrap";

import "../../../css/style.css";
import { PencilFill } from "react-bootstrap-icons";
import { GET, POSTMedia } from "../../../../utils/Utils";
import { GET_HOME_PAGE_INFORMATION, UPDATE_HOME_PAGE_INFORMATION } from "../../../../state/Constants";


type HomePageData = {mainHeadline: string, subheading: string, image: File | null};


export default function PagesSettings(): ReactElement{
    const [heroImage, setHeroImage] = useState<string>("");
    const saveHomepageInformation = (data: HomePageData) => {
        POSTMedia(UPDATE_HOME_PAGE_INFORMATION, data, () => {
            alert("Home page information updated successfully!");
        }, () => {

        });
    }

    const [homepageInformation, setHomePageInformation] = useState<any>({});
    const getHomepageInformation = () => {
      GET(
        GET_HOME_PAGE_INFORMATION,
        (response: any) => {
          const data = response.data.data;
          setHomePageInformation(data);
        },
        () => {}
      );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getHomepageInformation();
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
      <>
        <Row>
          <Col xs={12} className="heading-5">
            Home page
          </Col>
          <Col xs={12} className="pt-2">
            <Row>
              <Col xs={6}>
                <div className="d-flex flex-column w-auto">
                  Hero section image
                  <div
                    className="d-flex justify-content-center align-items-center text-white position-relative"
                    style={{
                      width: "100%",
                      height: "180px",
                      backgroundColor: "#555A",
                      backgroundImage: `url(${
                        heroImage != "" ? heroImage : homepageInformation.image
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <label
                      htmlFor="hero-section-image-chooser"
                      className="rounded-2 d-flex justify-content-center align-items-center position-absolute end-0 top-0 me-2 mt-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#000A",
                        cursor: "pointer",
                      }}
                    >
                      <PencilFill className="w-auto p-0" />
                    </label>
                    <input
                      type="file"
                      id="hero-section-image-chooser"
                      hidden={true}
                      onChange={(event) => {
                        const files = event.target.files;
                        if (files && files.length > 0) {
                          setHeroImage(URL.createObjectURL(files[0]));
                        }
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={6} className="ps-5 d-flex flex-column gap-3">
                <Row>
                  <label htmlFor="home-page-hero-section-main-headline">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    defaultValue={homepageInformation?.mainHeadline}
                    id="home-page-hero-section-main-headline"
                    className="form-control border-3"
                  />
                </Row>
                <Row>
                  <label>Subheading</label>
                  <input
                    type="text"
                    id="home-page-hero-section-subheading"
                    className="form-control border-3"
                    defaultValue={homepageInformation?.subheading}
                  />
                </Row>
                <Row className="justify-content-end pt-2">
                  <button
                    className="btn btn-primary w-auto"
                    onClick={() => {
                      const mainHeadlineInput = document.getElementById(
                        "home-page-hero-section-main-headline"
                      ) as HTMLInputElement;
                      const subheadingInput = document.getElementById(
                        "home-page-hero-section-subheading"
                      ) as HTMLInputElement;
                      const heroImageInput = document.getElementById(
                        "hero-section-image-chooser"
                      ) as HTMLInputElement;
                      const data: HomePageData = {
                        mainHeadline: "",
                        subheading: "",
                        image: null,
                      };

                      if (mainHeadlineInput) {
                        data.mainHeadline = mainHeadlineInput.value;
                      }

                      if (subheadingInput) {
                        data.subheading = subheadingInput.value;
                      }

                      if (heroImageInput) {
                        const files = heroImageInput.files;
                        if (files && files?.length > 0) {
                          data.image = files[0];
                        }
                      }

                      saveHomepageInformation(data);
                    }}
                  >
                    Save Changes
                  </button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
}