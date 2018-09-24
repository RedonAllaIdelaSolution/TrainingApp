import * as React from 'react';
import * as models from '../models/category';

interface DetailsState {
    category: models.Category;
    loading: boolean;
}

interface DetailsProps {
    id: number;
}

export class Details extends React.Component<DetailsProps, DetailsState> {
    constructor(props) {
        super(props);
        this.state = {
            category: null,
            loading: true
        };
        fetch('api/Categories/GetById/' + this.props.id)
            .then(response => response.json() as Promise<models.Category>)
            .then(data => {
                this.setState({ category: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Details.renderDetails(this.state.category);
        return <div>
            <h1>Category Details</h1>
            {contents}
        </div>
    }

    private static renderDetails(item: models.Category) {
        return <div>
            <div className="form-group">
                <label className="control-label col-sm-3">Id:</label> {item.Id}
            </div>
            <div className="form-group">
                <label className="control-label col-sm-3">Name:</label> {item.Name}
            </div>
        </div>;
    }
}