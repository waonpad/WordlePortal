import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { useCustomPath } from '../../../../contexts/CustomPathContext';
import { customPath } from '../../../../contexts/CustomPathContext';

export type ParticalRenderLinkProps = {
    path: customPath;
    partical_render_params?: any;
    partical_render_route_paths: string[];
    children?: React.ReactNode;
}

function ParticalRenderLink(props: ParticalRenderLinkProps): React.ReactElement {
    const {path, children, partical_render_params, partical_render_route_paths = []} = props;

    const location = useLocation();
    const custom_path = useCustomPath();

    const handleRenderCheck = (event: any) => {
        const params_check = partical_render_params !== undefined ? Object.keys(partical_render_params).map((param_key) => (
            Object.keys(custom_path?.path.params).includes(param_key) ?
            partical_render_params[param_key] === custom_path?.path.params[param_key] ? true : false
            : false
        )) : [false];
        
        // 部分更新するparamsが設定してあって、custom_path?.path.paramsに一致したものが無かったら通常のページ遷移をする
        if(params_check.includes(true) === false && partical_render_params !== undefined) {
            return null;
        }
        
        if(partical_render_route_paths.includes(path.route_path)) {
            // console.log('partical');
            event.preventDefault();

            history.pushState(null, '', path.path);
            custom_path?.changePath({
                path: path.path,
                route_path: path.route_path,
                params: path.params
            });
        }
        else {
            // console.log('full');
            return null;
        }
    }

    return (
        <Link to={path.path} onClick={handleRenderCheck}>
            {children}
        </Link>
    )
}

export default ParticalRenderLink;