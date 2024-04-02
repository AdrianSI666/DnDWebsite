import { Pagination } from "@mui/material";
import { EntryFullDTO } from "../../../services/openapi";
import { Page } from "../../../services/openapi/models/Page";
import { Col, Container, Form, Row } from "react-bootstrap";

interface IPaginationData {
    pageSize: number,
    changePage: (event?: React.ChangeEvent<unknown>, value?: number, size?: number) => Promise<void>,
    page: Page<EntryFullDTO>
}

export function CustomPagination(props: IPaginationData) {
    return <Container>
        <Row className="justify-content-center">
            <Form.Label htmlFor="pageSizeSelect" column sm={2}>
                <h5 className="text-md-center">Max results on page:</h5>
            </Form.Label>
            <Col md="auto">
            <Form.Select id="pageSizeSelect" defaultValue={10} onChange={e => {
                let newPage = Math.ceil((props.page.currentPage! * props.pageSize - props.pageSize + 1) / Number(e.target.value))
                props.changePage(e, newPage, Number(e.target.value))
            }}>
                <option value="5" key={5}>5</option>
                <option value="10" key={10}>10</option>
                <option value="20" key={20}>20</option>
            </Form.Select>
            </Col>
        </Row>
        <Row className="justify-content-md-center">
        <Col md="auto">
            <Pagination
                className="my-3"
                color="primary"
                showFirstButton
                showLastButton
                count={props.page.totalPages}
                page={props.page.currentPage}
                siblingCount={3}
                boundaryCount={2}
                variant="outlined"
                shape="rounded"
                onChange={props.changePage}
            />
            </Col>
        </Row>
    </Container>
}