import {useEffect, type ReactElement, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, Card, CardBody, Col, Row } from "react-bootstrap";

// import HeroSectionBackground from "../assets/ChatGPT Image Jun 28, 2025, 04_52_52 PM.webp";
import ContactAndFAQsBackroundImage from "../assets/ChatGPT Image Jun 28, 2025, 10_50_07 PM.webp";

import Soldat from "../assets/Soldat.jpg";
import Vanille from "../assets/vanille.jpg";
import Tristounet from "../assets/Tristounet.jpg";

import "./css/style.css";
import { GET, observeElement, unobserveElement } from "../utils/Utils";
import { GET_CATEGORIES_URL, GET_HOME_PAGE_INFORMATION, GET_SIZES_URL } from "../state/Constants";
import { Category, Size } from "../state/Types";
import { useNavigate } from "react-router";
import ScrollTo from "../custom-components/ScrollTo";


export default function Home(props: {onReceiveCategories?: CallableFunction}) : ReactElement{
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>();
  const getCategories = async () => {
    GET(
      GET_CATEGORIES_URL,
      (response: any) => {
        if (response.data.status == "ok") {
          // setCategoryRequest(response.data);
          setCategories(response.data.categories);
          if (props.onReceiveCategories){
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

  const [sizes, setSizes] = useState<Size[]>();
  const getSizes = () => {
    GET(GET_SIZES_URL, (response: any) => {
      setSizes(response.data.sizes);
    }, () => {});
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
    getSizes();
    getCategories();

    getHomepageInformation();
    
    const delayedPopupCard = document.getElementsByClassName("delayed-popup-card");
    if (delayedPopupCard){
      for (let i = 0; i < delayedPopupCard.length; i++){
        observeElement(delayedPopupCard[i], (entry: Element) => {
          console.log("Element is intersecting....");
          if (entry.classList.contains("delayed-popup-card")) {
            entry.classList.add("show");
          }
        });
      }
    }
    // intersectionObserver.observe(document.getElementsByTagName());

    return () => {
      if (delayedPopupCard){
        for (let i = 0; i < delayedPopupCard.length; i++){
          unobserveElement(delayedPopupCard[i])
        }
      }
    }
  }, [])
    return (
      <Row className="pt-5 mt-2 mt-md-3">
        <Col xs={12} className="px-0">
          <Row
            className="py-5"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('${homepageInformation?.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Col xs={12}>
              <Row className="justify-content-center">
                <Col xs={11} md={8} xl={7}>
                  <Row className="heading-1 fw-bold justify-content-center text-center py-3 text-white">
                    {homepageInformation?.mainHeadline}
                  </Row>

                  <Row className="heading-5 fw-medium justify-content-center text-center py-4 text-white">
                    {homepageInformation?.subheading}
                  </Row>
                  {/* <Row className="d-none d-md-flex fs-3 fw-semibold justify-content-center text-center py-3 text-white">
                  "Upload a photo and receive a custom drawing crafted just for
                  you by a professional artist."
                </Row> */}

                  <Row className="justify-content-center text-center pb-5 text-white">
                    <Col
                      xs={12}
                      lg={6}
                      className="d-flex justify-content-center text-center py-3"
                    >
                      <ScrollTo target="categories">
                        <button className="cta-button cta-button">
                          Request My Painting
                        </button>
                      </ScrollTo>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* <Row className="py-0 position-relative pb-5 bottom-0">
                <svg
                  viewBox={"0, 0 500 100"}
                  className="p-0 position-absolute top-0 start-0"
                >
                  <path
                    d="M0,0 C50,80 170,5 250,10 300,10 400,40 500,0 L500,0 500,50 0,50 Z"
                    fill="#000"
                    stroke="#000"
                  />
                </svg>
              </Row> */}
            </Col>
          </Row>

          {/* <section className="px-5 py-2 py-xxl-5">
            <Row className="justify-content-center pt-4">
              <Col
                xs={12}
                lg={5}
                xxl={3}
                className="pt-3 d-flex justify-content-center "
              >
                <div
                  className="move-up-on-visible move-up-on-visible-animate"
                  style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "10px",
                    backgroundImage: `url('${ArtistImage}')`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </Col>
              <Col
                xs={12}
                lg={7}
                xxl={4}
                className="d-flex flex-column justf-items-center text-left pt-3 fs-5"
              >
                <Row className="fs-1 fw-bold pb-4 justify-content-center justify-content-lg-start">
                  Meet the Artist
                </Row>
                <Row className="flex-column justify-content-center justify-content-center justify-content-lg-start text-center text-lg-start pb-5 pb-lg-1">
                  "Hi, I'm Denis Mark, a passionate artist with a love for
                  capturing life's moments in pencil and brush. With over [X
                  years] of experience, I've transformed hundreds of photos into
                  timeless artwork."
                </Row>
              </Col>
            </Row>
          </section> */}
          <Row className="bg-black text-white pt-5 position-relative d-none">
            <Col xs={12}>
              <Row className=" justify-content-center">
                <Col xs={12} md={10}>
                  <Row className="heading-3 fw-bold pb-4 justify-content-center">
                    How It Works
                  </Row>
                  <Row className="gap-1 flex-wrap justify-content-center px-5 px-lg-0 pb-5">
                    <Card
                      style={{}}
                      className="card-20 py-3 px-4 m-3 step-card delayed-popup-card popup-delay-02"
                    >
                      <Row className="justify-content-center heading-5 pb-2">
                        1
                      </Row>
                      <Row className="justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="card-icon"
                        >
                          <path d="M6 2l1 4h10l1-4z"></path>
                          <path d="M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <path d="M9 10a3 3 0 0 0 6 0"></path>
                        </svg>
                      </Row>
                      <Row
                        className="paragraph pt-3 justify-content-center text-center"
                        style={{}}
                      >
                        Select Product
                      </Row>
                      <Row className="justify-content-center pt-3">
                        <ScrollTo
                          target="categories"
                          className="w-auto text-decoration-none"
                        >
                          <button
                            className="btn w-auto"
                            style={{ background: "#FF8800", color: "#551100" }}
                          >
                            Select &gt;&gt;{" "}
                          </button>
                        </ScrollTo>
                      </Row>
                    </Card>
                    <Card
                      style={{}}
                      className="card-20 py-3 px-4 m-3 step-card delayed-popup-card popup-delay-04"
                    >
                      <Row className="justify-content-center heading-5 pb-2">
                        2
                      </Row>
                      <Row className="justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="card-icon"
                        >
                          <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
                          <path d="M12 12v9"></path>
                          <path d="M8 16l4-4 4 4"></path>
                        </svg>
                      </Row>
                      <Row
                        className="paragraph pt-3 justify-content-center text-center"
                        style={{}}
                      >
                        Upload Your Photo - Choose the image you want drawn.
                      </Row>
                    </Card>

                    <Card
                      style={{}}
                      className="card-20 py-3 px-4 m-3 step-card delayed-popup-card popup-delay-06"
                    >
                      <Row className="justify-content-center heading-5 pb-2">
                        3
                      </Row>
                      <Row className="justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="card-icon"
                        >
                          <line x1="4" y1="21" x2="4" y2="14"></line>
                          <line x1="4" y1="10" x2="4" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12" y2="3"></line>
                          <line x1="20" y1="21" x2="20" y2="16"></line>
                          <line x1="20" y1="12" x2="20" y2="3"></line>
                          <line x1="1" y1="14" x2="7" y2="14"></line>
                          <line x1="9" y1="8" x2="15" y2="8"></line>
                          <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                      </Row>
                      <Row
                        className="paragraph pt-3 justify-content-center text-center"
                        style={{}}
                      >
                        Customize - Select drawing style, size, and delivery
                        format (digital/physical).
                      </Row>
                    </Card>

                    <Card
                      style={{}}
                      className="card-20 py-3 px-4 m-3 step-card delayed-popup-card popup-delay-08"
                    >
                      <Row className="justify-content-center heading-5 pb-2">
                        4
                      </Row>
                      <Row className="justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="card-icon"
                        >
                          <line x1="4" y1="21" x2="4" y2="14"></line>
                          <line x1="4" y1="10" x2="4" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12" y2="3"></line>
                          <line x1="20" y1="21" x2="20" y2="16"></line>
                          <line x1="20" y1="12" x2="20" y2="3"></line>
                          <line x1="1" y1="14" x2="7" y2="14"></line>
                          <line x1="9" y1="8" x2="15" y2="8"></line>
                          <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                      </Row>
                      <Row
                        className="paragraph pt-3 justify-content-center text-center"
                        style={{}}
                      >
                        Get It Drawn - The artist begins crafting your artwork.
                      </Row>
                    </Card>

                    <Card
                      style={{}}
                      className="card-20 py-3 px-4 m-3 step-card delayed-popup-card popup-delay-1"
                    >
                      <Row className="justify-content-center heading-5 pb-2">
                        5
                      </Row>
                      <Row className="justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFF"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="card-icon"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </Row>
                      <Row
                        className="paragraph pt-3 justify-content-center text-center"
                        style={{}}
                      >
                        Receive Your Artwork - Delivered within [X] days via
                        email or shipping.
                      </Row>
                    </Card>
                  </Row>
                  <Row className="justify-content-center pb-5">
                    <a href="#categories" className="w-auto">
                      <button className="cta-button cta-button">
                        Request My Painting
                      </button>
                    </a>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="px-5 py-5" id="categories">
            <Col xs={12}>
              <Row className=" justify-content-center pb-3 heading-4 fw-bold">
                Explore Categories
              </Row>
              <Row className="justify-content-center text-center py-4 paragraph">
                <Col xs={10} md={8} xxl={6}>
                  Every painting tells a unique story. Explore our categories to
                  find the style that speaks to your heart - and let us bring it
                  to life on canvas.
                </Col>
              </Row>
              <Row className=" justify-content-center">
                <Col xs={12} md={10} lg={9} xxl={9}>
                  {categories?.map((category) => {
                    if (category.images && category.images.length > 0) {
                      return (
                        <>
                          <Row className="heading-5 py-3 fw-bold">
                            {category.category}
                          </Row>
                          <Row>
                            <Col
                              xs={2}
                              lg={1}
                              className="d-flex flex-column justify-content-center align-items-end"
                            >
                              <div
                                className="heading-2 rounded-2 d-lex justify-content-center align-items-center px-3 py-2"
                                style={{ boxShadow: "0px 5px 15px 1px #555" }}
                                onClick={(event) => {
                                  const scrollContainer: Element | undefined = (
                                    event.target as HTMLElement
                                  ).parentElement?.parentElement?.children[1]
                                    .children[0];
                                  // const images = scrollContainer?.children;
                                  // let scrollWidth = 0;
                                  // if (images && images.length > 0) {
                                    // scrollWidth = parseInt(
                                    //   (images[0] as HTMLElement).style.width
                                    // );
                                    // console.dir((images[0] as HTMLElement));
                                  // }
                                  scrollContainer?.scrollBy({
                                    left: -200,
                                    behavior: "smooth",
                                  });
                                  console.log(scrollContainer);
                                }}
                              >
                                &#8249;
                              </div>
                            </Col>
                            <Col xs={8} lg={10}>
                              <Row className="gap-2 gap-md-3 gap-lg-4 flex-nowrap overflow-x-auto overflow-y-hidden mb-5">
                                {category.images.map((image) => {
                                  return (
                                    <Card
                                      key={
                                        image.imageID + "-" + image.categoryID
                                      }
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
                              </Row>
                            </Col>
                            <Col
                              xs={2}
                              lg={1}
                              className="d-flex flex-column justify-content-center align-items-end"
                            >
                              <div
                                className="heading-2 rounded-2 d-lex justify-content-center align-items-center px-3 py-2"
                                style={{
                                  boxShadow: "0px 5px 15px 1px #555",
                                  cursor: "pointer",
                                }}
                                onClick={(event) => {
                                  const scrollContainer: Element | undefined = (
                                    event.target as HTMLElement
                                  ).parentElement?.parentElement?.children[1]
                                    .children[0];
                                  scrollContainer?.scrollBy({
                                    left: 200,
                                    behavior: "smooth",
                                  });
                                  console.log(scrollContainer);
                                }}
                              >
                                &#8250;
                              </div>
                            </Col>
                          </Row>
                        </>
                      );
                    }
                  })}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row
            className="overflow-hidden position-relative"
            style={{
              background:
                "linear-gradient(#000000EE, #000000EE), linear-gradient(45deg, #AA33FF 10%, #8822FF 40%, #000022 80%)",
            }}
          >
            <Col xs={12}>
              <Row className="position-absolute w-50">
                <svg viewBox="0 0 800 600" className="">
                  <path
                    d="M0,0 L800,0 C700,100 600,90 550,200 530,250 460,400 350,500 C210,600 150, 580 -10,600 z"
                    fill="#000A"
                  />
                </svg>
              </Row>
              <Row className="justify-content-center py-5">
                <Col xs={10}>
                  <Row className="flex-column-reverse flex-md-row justify-content-center justify-content-lg-start">
                    <Col xs={12} lg={6}>
                      <Row className="justify-content-center gap-3">
                        <Card
                          className="delayed-popup-card popup-delay-02"
                          style={{
                            width: "200px",
                            height: "300px",
                            backgroundColor: "#EEEEEE",
                            backgroundImage: `url(${Vanille})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundClip: "padding-box",
                          }}
                        ></Card>
                        <Card
                          className="delayed-popup-card popup-delay-04"
                          style={{
                            width: "200px",
                            height: "300px",
                            backgroundColor: "#EEEEEE",
                            backgroundImage: `url(${Tristounet})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundClip: "padding-box",
                          }}
                        ></Card>
                        <Card
                          className="delayed-popup-card popup-delay-06"
                          style={{
                            width: "200px",
                            height: "300px",
                            backgroundColor: "#EEEEEE",
                            backgroundImage: `url(${Soldat})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundClip: "padding-box",
                          }}
                        ></Card>
                        {/* <Card
                        style={{
                          width: "200px",
                          height: "300px",
                          backgroundColor: "#EEEEEE",
                          backgroundImage: `url(${ChatGentleman})`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundClip: "padding-box",
                        }}
                      ></Card> */}
                      </Row>
                    </Col>
                    <Col
                      xs={12}
                      md={8}
                      lg={6}
                      className="d-flex flex-column justify-content-start align-items-center text-white text-center pb-4 px-2 px-md-0"
                      style={{}}
                    >
                      <Row className="fw-bold pb-4">
                        <Col xs={12} style={{ zIndex: 100 }}>
                          <span className=" text-white heading-4">Gallery</span>
                          <hr
                            style={{
                              border: "solid",
                              borderWidth: "3px",
                              color: "white",
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="px-2 px-md-5">
                        <p className="paragraph">
                          Each stroke tells a story, and every canvas captures a
                          moment. Explore the gallery to see a collection of
                          hand-drawn and digitally painted artworks, created
                          with heart and imagination. Whether it's portraits,
                          landscapes, or abstract expressions—these pieces
                          reflect the journey, passion, and creativity behind
                          every request.
                        </p>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* <Row className="position-relative">
              <svg viewBox="0 0 500 30">
                <defs>
                  <linearGradient
                    id="myRadial"
                    x1="0%"
                    y1="85%"
                    x2="100%"
                    y2="80%"
                  >
                    <stop offset="10%" stop-color="#AA33FF" />
                    <stop offset="55%" stop-color="#8822FF" />
                    <stop offset="85%" stop-color="#5522AA" />
                    <stop offset="98%" stop-color="#210055" />
                    <stop offset="100%" stop-color="#000022" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,0 L250,20 500,0 L500,0 500,30 L500,30 L0,30 z"
                  fill="#FFF"
                  stroke="#FFF"
                />
              </svg>
            </Row> */}
            </Col>
          </Row>
          <Row className="justify-content-center bg-white pb-5 px-md-5">
            <Col
              xs={10}
              lg={12}
              className=" ms-0 py-5 px-3 px-md-5 overflow-x-hidden"
            >
              <Row className="heading-4 fw-bold pb-4 justify-content-center text-center text-md-start">
                What Customers Say
              </Row>
              <Row className="justify-content-center">
                <Col xs={12} md={10} lg={9}>
                  <Row className="overflow-x-auto overflow-y-hidden flex-nowrap gap-3 py-4 px-3 px-md-5 pb-3">
                    <Card
                      style={{ width: "250px" }}
                      className="rounded-2 review-card p-3"
                    >
                      <Row className="fw-semibold px-2 heading-5">
                        Emily Carter ⭐⭐⭐⭐⭐
                        <hr />
                      </Row>
                      <Row className="pt-3 px-3 paragraph">
                        “Absolutely stunning work! I ordered a portrait of my
                        grandparents, and it brought tears to my eyes. The
                        detail and care were incredible.”
                      </Row>
                    </Card>
                    <Card
                      style={{ width: "250px" }}
                      className="rounded-2 review-card p-3"
                    >
                      <Row className="fw-semibold px-2 heading-5">
                        James Walker ⭐⭐⭐⭐⭐
                        <hr />
                      </Row>
                      <Row className="pt-3 px-3 paragraph">
                        “From start to finish, the process was smooth and
                        professional. The final painting was even better than I
                        expected — truly a work of art.”
                      </Row>
                    </Card>
                    <Card
                      style={{ width: "250px" }}
                      className="rounded-2 review-card p-3"
                    >
                      <Row className="fw-semibold px-2 heading-5">
                        Olivia Bennett ⭐⭐⭐⭐⭐
                        <hr />
                      </Row>
                      <Row className="pt-3 px-3 paragraph">
                        “I gave a rough idea, and the artist brought it to life
                        beautifully. It now hangs in my bedroom and makes me
                        smile every day.”
                      </Row>
                    </Card>
                    <Card
                      style={{ width: "250px" }}
                      className="rounded-2 review-card p-3"
                    >
                      <Row className="fw-semibold px-2 heading-5">
                        Michael Thompson ⭐⭐⭐⭐⭐
                        <hr />
                      </Row>
                      <Row className="pt-3 px-3 paragraph">
                        “Incredible talent! I’ve commissioned several pieces and
                        each one has been unique, expressive, and full of life.”
                      </Row>
                    </Card>

                    <Card
                      style={{ width: "250px" }}
                      className="rounded-2 review-card p-3"
                    >
                      <Row className="fw-semibold px-2 heading-5">
                        Sophia Mitchell ⭐⭐⭐⭐⭐
                        <hr />
                      </Row>
                      <Row className="pt-3 px-3 paragraph">
                        “The colors, the texture, the emotion — everything about
                        the painting was just perfect. Highly recommended for
                        anyone looking for custom art.”
                      </Row>
                    </Card>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="py-4 bg-white px-3 px-md-5">
            <Col xs={12}>
              <Row className="justify-content-center align-items-center px-5">
                <Col xs={12} md={6} lg={8}>
                  <Row className="justify-content-center heading-4 fw-bold pb-4 text-center text-xxl-start">
                    Ready to Get Your Photo Drawn?
                  </Row>

                  <Row className="justify-content-center text-center paragraph">
                    Upload your favorite photo now and receive a custom piece of
                    art you'll cherish forever.
                  </Row>

                  <Row className="justify-content-center pt-4">
                    <ScrollTo target="categories">
                      <button className="cta-button cta-button w-auto">
                        Request My Painting
                      </button>
                    </ScrollTo>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="py-5 bg-white" id="painting-size-container">
            <Col xs={12}>
              {/* <svg viewBox="0 0 500 47" style={{width: "100%", height: "100%"}} className="position-absolute">
                        <rect x={0} y={2} width={30} height={7} fill="#0033FF" rx={3.5} transform="rotate(135 0 47)"/>
                        <rect x={0} y={14} width={60} height={7} fill="#0033FF" rx={3.5} transform="rotate(135 12 47)"/>
                        <rect x={0} y={26} width={100} height={7} fill="#0033FF" rx={3.5} transform="rotate(135 24 47)"/>
                        <rect x={0} y={38} width={40} height={7} fill="#0033FF" rx={3.5} transform="rotate(135 36 47)"/>
                    </svg> */}
              <Row className="heading-4 fw-bold pb-4 justify-content-center text-center text-md-start">
                Simple & Transparent Pricing
              </Row>
              <Row className="justify-content-center align-items-center pt-3">
                <Col xs={12} md={10} lg={8}>
                  <Row className="flex-column flex-lg-row align-items-center justify-content-center gap-3 pt-4">
                    {sizes?.map((size) => {
                      return (
                        <Card className="card-20">
                          {/* <CardHeader className="justify-content-center text-center fs-4 fw-bold">
                      {size.size}
                    </CardHeader> */}
                          <CardBody>
                            <Row className=" fw-semibold justify-content-center heading-6">
                              {size.width}
                              {size.unit} x {size.height}
                              {size.unit}
                            </Row>
                            <Row className="justify-content-center pt-3">
                              <ScrollTo target="categories">
                                <button className="btn btn-outline-dark text">
                                  Request My Painting
                                </button>
                              </ScrollTo>
                            </Row>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row
            className="pb-4"
            style={{
              backgroundImage: `linear-gradient(0deg, #0005, #0005), url('${ContactAndFAQsBackroundImage}')`,
              backgroundSize: "cover, cover",
              backgroundRepeat: "no-repeat, no-repeat",
            }}
          >
            <Col xs={12}>
              <Row>
                <svg viewBox="0 0 500 80">
                  <path d="M0,0 C180,40 320,40 500,0" fill="white" />
                </svg>
              </Row>
              <Row className="justify-content-center gap-3 px-4 px-md-5">
                <Col xs={12} md={10} lg={6}>
                  <Row className="heading-4 fw-bolder text-white justify-content-center text-center text-md-start">
                    FAQs
                  </Row>
                  <Accordion>
                    <AccordionHeader>
                      <span className="heading-6">
                        What photo formats do you accept?
                      </span>
                    </AccordionHeader>
                    <AccordionBody className="bg-white text">
                      Content
                    </AccordionBody>
                  </Accordion>

                  <Accordion>
                    <AccordionHeader>
                      <span className="heading-6">How long does it take?</span>
                    </AccordionHeader>
                    <AccordionBody className="bg-white text">
                      Content
                    </AccordionBody>
                  </Accordion>

                  <Accordion>
                    <AccordionHeader>
                      <span className="heading-6">
                        Can I request revisions?
                      </span>
                    </AccordionHeader>
                    <AccordionBody className="bg-white text">
                      Content
                    </AccordionBody>
                  </Accordion>

                  <Accordion>
                    <AccordionHeader>
                      <span className="heading-6">
                        How is the artwork delivered?
                      </span>
                    </AccordionHeader>
                    <AccordionBody className="bg-white text">
                      Content
                    </AccordionBody>
                  </Accordion>
                </Col>
              </Row>

              <Row className="justify-content-center pt-5 px-md-5">
                <Col xs={9} lg={6} className="d-flex flex-column gap-3">
                  <Row className="heading-4 fw-bolder text-white text-center text-md-start justify-content-center">
                    Contact Form
                  </Row>
                  <Row>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email here. ex: example@gmail.com"
                    />
                  </Row>
                  <Row>
                    <textarea rows={10} className="form-control"></textarea>
                  </Row>
                  <Row className="justify-content-end">
                    <button className="btn btn-primary w-auto text">
                      SEND
                    </button>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
}