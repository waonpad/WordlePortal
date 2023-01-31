import React, { useState, useCallback, useEffect, useRef } from "react";
import { Area, MediaSize } from "react-easy-crop";
import { Theme, makeStyles } from '@material-ui/core';
import CropperModal from "@/common/cropimage/components/CropperModal";
import getCroppedImg from "@/common/cropimage/components/getCroppedImg";
import { green } from "@mui/material/colors";
import { Box, Button } from "@mui/material";

type CropImageProps = {
    default_img_src?: string;
    crop_width: number;
    aspect_ratio: number;
    display_radius: any;
    component_key: any;
}

const useStyles = makeStyles<Theme, any>((theme: Theme) => ({
    root: props => ({
        // marginTop: 30,
        minWidth: "100%",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        flexFlow: "column",
        // "& .file-upload-container": {
        // width: 500,
        // marginTop: 10,
        // "& .button": {
        //     backgroundColor: "#00A0FF",
        //     color: "white"
        // }
        // },
        "& .img-container": {
            // marginTop: 40,
            width: `${props.crop_width}px`,
            height: `${props.crop_width / props.aspect_ratio}px`,
            display: "flex",
            alinItems: "center",
            borderRadius: props.display_radius,
            border: `2px solid ${green[400]}`,
            overflow: "hidden",
            backgroundColor: green[200],
            padding: 0,
            "&:hover": {
                backgroundColor: green[300]
            },
            "& .img": {
                width: "100%",
                objectFit: "contain",
                // backgroundColor: "#EAEAEA"
            },
            "& .no-img": {
                // backgroundColor: "#EAEAEA",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 'small',
                fontWeight: 'bold'
            }
        }
    })
}));

function CropImage(props: CropImageProps): React.ReactElement {
    const {default_img_src, crop_width, aspect_ratio, display_radius, component_key} = props;
    // const crop_width = 300;
    // const aspect_ratio = 2 / 1;
    // const display_radius = '10px';

    const styleProps = {crop_width: crop_width, aspect_ratio: aspect_ratio, display_radius: display_radius}
    const classes = useStyles(styleProps);
    /** Cropモーダルの開閉 */
    const [isOpen, setIsOpen] = useState(false);

    /** アップロードした画像URL */
    const [imgSrc, setImgSrc] = useState("");

    /** 画像の拡大縮小倍率 */
    const [zoom, setZoom] = useState(1);
    /** 画像拡大縮小の最小値 */
    const [minZoom, setMinZoom] = useState(1);

    /** 切り取る領域の情報 */
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    /** 切り取る領域の情報 */
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

    /** 切り取ったあとの画像URL */
    const [croppedImgSrc, setCroppedImgSrc] = useState<any>();
    
    // inputをrefに入れてクリックイベントを発火させる
    const inputRef = useRef(null);

    const handleFileUpload = () => {
        console.log('click');
        (inputRef!.current! as any).click();
    }
    // 

    /**
     * ファイルアップロード後
     * 画像ファイルのURLをセットしモーダルを表示する
     */
    const onFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
            if (reader.result) {
                setImgSrc(reader.result.toString() || "");
                setIsOpen(true);
            }
            });
            reader.readAsDataURL(e.target.files[0]);
        }
        },
        []
    );
    /**
     * Cropper側で画像データ読み込み完了
     * Zoomの最小値をセットしZoomの値も更新
     */
    const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
        const { width, height } = mediaSize;
        const mediaAspectRadio = width / height;
        if (mediaAspectRadio > aspect_ratio) {
        // 縦幅に合わせてZoomを指定
        const result = crop_width / aspect_ratio / height;
        setZoom(result);
        setMinZoom(result);
        return;
        }
        // 横幅に合わせてZoomを指定
        const result = crop_width / width;
        setZoom(result);
        setMinZoom(result);
    }, []);

    /**
     * 切り取り完了後、切り取り領域の情報をセット
     */
    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    /**
     * 切り取り後の画像を生成し画面に表示
     */
    const showCroppedImage = useCallback(async () => {
        if (!croppedAreaPixels) return;
        try {
        const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
        // console.log('切り取り後画像URL');
        // console.log(croppedImage);
        setCroppedImgSrc(croppedImage);
        } catch (e) {
        console.error(e);
        }
    }, [croppedAreaPixels, imgSrc]);

    return (
        <div className={classes.root} data-key={component_key} data-cropped-img-src={croppedImgSrc ? croppedImgSrc : null}>
        {/* <div className="file-upload-container">
            <Button variant="contained" component="label" className="button">
            Upload File
            <input type="file" hidden onChange={onFileChange} />
            </Button>
        </div> */}
        <input
            hidden
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
        />
        <Box className="img-container" component={Button} fullWidth onClick={handleFileUpload} style={{cursor: 'pointer'}}>
            {
                croppedImgSrc ? (
                <img src={croppedImgSrc} alt="Cropped" className="img" />
                )
                :
                default_img_src ? (
                    <img src={`/storage/${default_img_src}`} alt="Default" className="img" />
                )
                :
                (
                <div className="no-img">
                    UPLOAD FILE
                </div>
                )
            }
        </Box>
        <CropperModal
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            onCropComplete={onCropComplete}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            imgSrc={imgSrc}
            showCroppedImage={showCroppedImage}
            onMediaLoaded={onMediaLoaded}
            minZoom={minZoom}
            cropWidth={crop_width}
            aspectRatio={aspect_ratio}
            displayRadius={display_radius}
        />
        </div>
    );
};
export default CropImage;
