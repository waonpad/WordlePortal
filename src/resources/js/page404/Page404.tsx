import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link } from "react-router-dom";

function Page404(): React.ReactElement {
    return (
        <React.Fragment>
            <h1>404 NOT FOUND</h1>
            <p>お探しのページが見つかりませんでした。</p>
            <Link to="/">Topに戻る</Link>
        </React.Fragment>
    );
}

export default Page404;