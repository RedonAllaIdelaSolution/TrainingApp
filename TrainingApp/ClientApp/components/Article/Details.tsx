import * as React from 'react';
import * as article from '../models/article';

interface DetailsState {
    article: article.Article;
    loading: boolean;
}

interface DetailsProps {
    id: number;
}

export class Details extends React.Component<DetailsProps, DetailsState>{
    constructor(props) {
        super(props);
        this.state = {
            article: null,
            loading: true
        };
        fetch('api/Articles/' + this.props.id)
            .then(response => response.json() as Promise<article.Article>)
            .then(data => {
                this.setState({ article: data, loading: false });
            });
    }

    public render(){
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Details.renderDetails(this.state.article);
        return <div>
            <h1>Article Details</h1>
                {contents}
                </div>
    }

    private static renderDetails(item: article.Article) {
        return <div className='details'>
            <label>Id</label>
            <div>{item.Id}</div>
            <label>Name</label>
            <div>{item.Name}</div>
        </div>;
    }
}