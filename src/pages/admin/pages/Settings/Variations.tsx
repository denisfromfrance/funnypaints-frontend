import { ReactElement } from "react";
import { Col, Row } from "react-bootstrap";
import { POST } from "../../../../utils/Utils";
import { Variation } from "../../../../state/Types";
import { Trash } from "react-bootstrap-icons";

export default function Variations(props: {variations: Variation[] | undefined}): ReactElement {
    const addVariant = async(variation: string) => {
        POST("admin/product/variations/add", {variation: variation}, () => {
            alert("Variant added successfully!");
        }, () => {});
    }

    const deleteVariant = async(variation: Variation) => {
        POST("admin/product/variations/delete", {id: variation.id}, () => {
          alert("Variation Deleted Successfully!");
        }, () => {})
    }

    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={5}>
              <input type="text" className="form-control" id="variant" />
            </Col>
            <Col xs={3}>
              <button
                className="btn btn-success"
                onClick={() => {
                  const variant = (
                    document.getElementById("variant") as HTMLInputElement
                  ).value;
                  addVariant(variant);
                }}
              >
                Add Variant
              </button>
            </Col>
          </Row>
          <hr/>
        </Col>
        <Col xs={5}>
          <table className="table table-striped">
            <thead>
              <th></th>
              <th>Product Variant</th>
              <th>Action</th>
            </thead>
            <tbody>
              {props.variations?.map((variation) => {
                return (
                  <tr className="pb-0">
                    <td></td>
                    <td className=" align-content-center">
                      <Row className="d-flex align-items-center h-100">{variation.variation}</Row>
                    </td>
                    <td>
                      <button className="btn btn-outline-danger px-2" onClick={() => {
                        deleteVariant(variation);
                      }}>
                        <Trash className="w-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
      </Row>
    );
}