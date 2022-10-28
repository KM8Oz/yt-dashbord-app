import * as React from "react"
import { useState } from "react";
import { useNavigate, useNavigation } from 'react-router-dom';
import { IOPrivate, IOPublic } from "../tools/socket";
// import { useStore } from "store";
import QRCode from "qrcode.react"
import { animated } from "react-spring";
import styled from "styled-components";
import Icon from "../assets/icon.svg?url"
import {ThemeContext} from "../store/theme"
import { get_machine_id, resize_win } from "../tools/machine_id";
import { AppStore } from "../store/User";
interface _COLORS {
    NORMAL: string[];
    ERROR: string[];
    ACTIVATION: string[]
}
function Login(props: any) {
    
    const COLORS: _COLORS = { NORMAL: ["#4C7A6C", "#6C6C6C", "Login"], ERROR: ["#F45C5C", "#575757", "Try again"], ACTIVATION: ["#f31237", "#575757", "Activate"] };
    let _navigator = useNavigate();
    const [color, setColor] = useState(COLORS.NORMAL);
    const [key, setkey] = useState("");
    const { current } = React.useContext(ThemeContext)
    const [userPass, setUserPass] = useState("");
    const [show, setshow] = useState(false);
    const [machinID, setmachinID] = useState(null);
    const [showqrcode, setshowqrcode] = useState(false);
    const [QrUrl, setQrUrl] = useState("");
    const User = new AppStore();
    // const {current} = React.useContext(ThemeContext)
    React.useEffect(() => {
        setColor(COLORS.ERROR)
        // setshow(true)
        resize_win(291, 357)
        get_machine_id().then((ID) => {
            setmachinID(ID);
            setColor(COLORS.NORMAL)
            IOPublic.emit("call", "licence.check", { deviceid: ID }, async (err: any, res: { status: any; }) => {
                // dcid
                if (!res?.status || err) {
                    setshow(false)
                    setColor(COLORS.ACTIVATION)
                } else {
                    User.ssid().then((ssid)=>{
                        let _private = IOPrivate(ssid);
                        _private.on("error", () => {
                            _navigator("/")
                            setshow(true)
                            setshowqrcode(false)
                            resize_win(291, 357)
                        });
                        _private.on("tk_save", async (res: any) => {
                            if (res.tk) {
                                User.setssid(res.tk).then(()=>{
                                    _navigator("/Home")
                                    resize_win(900, 700)
                                })
                                // await orbitInit(res.dcid);
                            }
                        })
                    })

                }
            })
        })

    }, []);
    const keylog = () => {
        IOPublic.emit("call", "licence.activate", { deviceid: machinID, key: key }, (err: any, res: { status: any; authurl: React.SetStateAction<string>; }) => {
            if (!res?.status || err) {
                setshow(false)
                setshowqrcode(false)
                setColor(COLORS.ERROR)
            } else {
                setshowqrcode(true)
                setQrUrl(res.authurl)
            }
        })
    }

    const LoginAction = () => {
        IOPublic.emit("call", "machine.login", { deviceid: machinID, otpcode: userPass }, (err: any, res: { status: any; ssid: any; }) => {
            // console.log(err, res)
            if (res && res?.status) {
                setColor(COLORS.NORMAL);
                setshow(s=>s)
                User.setssid(res?.ssid).then(()=>{
                    User.ssid().then((ssid) => {
                        console.log("ssid:",ssid);
                        if (ssid){
                             _navigator("/Home");
                             resize_win(900, 700)
                        }
                    })
                })
                    .catch((err) => {
                        console.log("setssid error:",err);
                    })
            } else {
                setColor(COLORS.ERROR)
                setshow(s=>s)
            };
        })
    }
    return (
        show ? <animated.svg
            data-tauri-drag-region
            width={291}
            height={351}
            fill="none"
            className="draggable"
        >
            <rect
                x={2}
                y={2}
                width={287}
                height={347}
                rx={13}
                fill={current.values.secondary}
                stroke={color[0]}
                strokeWidth={3}
                strokeLinejoin="round"
            />
            <>
                <svg x="93" y="40" width="100" height="100" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18" y="18" width="988" height="988" rx="494" fill="white" />
                    <path d="M283.844 516.648H296.053L254.374 437.921H233.745L212.695 412.661V353.3H337.311L357.519 377.718V353.3H481.714L502.764 378.56V437.921H474.136L424.037 532.225L432.036 541.908V572.641C421.09 572.641 413.933 574.606 410.565 578.535C407.478 582.464 405.934 588.779 405.934 597.48V603.795C407.899 603.795 409.583 602.672 410.986 600.427L422.774 608.005L443.824 633.265C442.14 646.456 437.369 656.42 429.51 663.156C421.652 669.892 412.109 673.26 400.882 673.26C389.936 673.26 379.131 669.471 368.465 661.893C357.8 669.471 346.714 673.26 335.206 673.26C323.98 673.26 311.069 666.524 296.474 653.052C281.88 639.58 273.74 624.564 272.056 608.005L283.844 600.427C284.967 602.953 287.633 604.216 291.843 604.216C303.912 604.216 309.946 593.691 309.946 572.641H304.894L283.844 547.381V516.648ZM331.838 530.541C334.645 528.857 338.013 525.489 341.942 520.437H352.888C356.537 525.489 359.905 528.857 362.992 530.541C367.764 523.805 374.78 519.595 384.042 517.911L444.666 400.873H469.926V365.088H369.307V400.873H394.988L354.993 487.599H339.837L299.421 400.873H325.523V365.088H224.483V400.873H249.743L309.946 517.911C319.489 519.595 326.786 523.805 331.838 530.541ZM348.678 622.319C358.782 631.02 369.869 635.37 381.937 635.37C394.287 635.37 403.268 628.353 408.881 614.32C406.917 615.443 404.671 616.004 402.145 616.004C382.499 616.004 372.675 601.55 372.675 572.641C372.675 549.065 381.937 537.277 400.461 537.277V526.752C395.129 526.752 391.059 527.033 388.252 527.594C385.446 527.875 381.937 529.559 377.727 532.646C373.517 535.733 369.728 540.364 366.36 546.539C359.624 545.136 353.309 540.224 347.415 531.804C341.521 539.382 335.206 544.294 328.47 546.539C324.822 540.364 320.892 535.733 316.682 532.646C312.472 529.559 308.964 527.875 306.157 527.594C303.351 527.033 299.421 526.752 294.369 526.752V537.277C312.893 537.277 322.155 549.065 322.155 572.641C322.155 593.972 317.665 607.303 308.683 612.636C304.473 614.881 299.141 616.004 292.685 616.004L285.949 614.32C291.563 628.353 300.404 635.37 312.472 635.37C324.822 635.37 336.048 631.02 346.152 622.319H348.678ZM358.361 437.921H340.258L352.467 466.549L369.307 426.975L358.361 413.924V437.921Z" fill="green" />
                    <path d="M731.979 618.53C731.979 633.405 737.312 641.685 747.977 643.369V673.26C733.663 673.26 723.419 672.558 717.244 671.155C711.069 669.752 705.737 666.243 701.246 660.63C699.001 662.033 695.492 666.664 690.721 674.523L688.195 678.312H648.2C642.587 668.489 638.236 662.595 635.149 660.63C630.939 666.243 625.887 669.752 619.993 671.155C614.099 672.558 603.714 673.26 588.839 673.26L567.789 643.79V618.109C578.454 616.425 583.787 608.145 583.787 593.27C583.787 587.095 582.805 580.78 580.84 574.325C577.753 572.922 574.244 572.22 570.315 572.22L549.265 546.96V516.648H559.79L542.529 437.921H530.741L509.691 412.661V353.3H626.729L647.779 378.56V437.921H626.308L643.99 522.121L654.515 534.751V516.648H667.145L684.406 433.29L667.145 412.661V353.3H784.183L805.233 378.56V437.921H777.868L757.239 530.541L766.922 541.908V572.22C755.976 572.501 747.416 577.412 741.241 586.955C735.066 596.498 731.979 607.023 731.979 618.53ZM734.926 526.331C720.331 526.331 709.245 532.927 701.667 546.118C694.65 541.066 688.195 534.891 682.301 527.594H665.461V536.014C671.074 539.382 673.881 545.136 673.881 553.275C673.881 561.414 670.373 570.957 663.356 581.903C656.339 592.568 650.866 599.024 646.937 601.269C643.288 599.024 637.956 592.568 630.939 581.903C623.922 570.957 620.414 561.555 620.414 553.696C620.414 545.557 623.221 539.663 628.834 536.014V527.594H611.994C607.784 533.769 601.75 539.943 593.891 546.118C585.471 532.927 574.244 526.331 560.211 526.331V536.856C570.876 538.259 579.577 544.995 586.313 557.064C593.049 568.852 596.417 580.78 596.417 592.849C596.417 611.934 590.663 622.6 579.156 624.845V637.475C592.347 637.475 601.89 634.809 607.784 629.476C610.871 626.95 613.678 623.442 616.204 618.951C622.94 626.529 629.255 634.388 635.149 642.527H658.725L678.091 618.951C683.704 627.932 690.16 633.405 697.457 635.37C703.632 636.773 709.806 637.475 715.981 637.475V624.845C704.754 622.6 699.141 611.934 699.141 592.849C699.141 580.78 702.509 568.852 709.245 557.064C715.981 544.995 724.541 538.259 734.926 536.856V526.331ZM772.395 400.873V365.088H678.933V400.873H702.509L678.933 516.648H687.774C693.107 523.945 697.317 528.436 700.404 530.12C705.456 523.665 712.192 519.595 720.612 517.911L747.135 400.873H772.395ZM594.733 530.12C597.54 527.875 601.609 523.384 606.942 516.648H614.52L591.365 400.873H614.941V365.088H521.479V400.873H546.739L572.841 517.911C581.542 519.034 588.839 523.103 594.733 530.12Z" fill="green" />
                    <rect x="18" y="18" width="988" height="988" rx="494" stroke="green" strokeWidth="36" />
                </svg>
            </>
            {/* <path
        d="M145.171 103C122.551 103 104 84.644 104 62c0-18.47 12.228-34.087 29.011-39.217v5.688c-13.449 4.973-23.209 17.923-23.209 33.114v1.69c.171 19.375 16.06 34.463 35.411 34.6.832.016 1.657-.009 2.475-.07V37.827l.853-.854 20.905 12.215V75.24l-11.263 6.235v-5.552l5.12-3.502.341-19.39-9.557-5.979V102.02c-2.872.641-5.857.98-8.916.98z"
        fill="#fff"
      />
      <path
        d="M145 21c22.686 0 41.094 18.46 41 41.17.075 18.038-11.727 33.372-27.988 38.763v-5.58c13.097-5.424 22.455-17.211 22.635-32.078l.001-1.38c-.013-19.48-15.963-35.6-35.423-35.6-.576 0-1.149.015-1.718.042v60.86l-1.024.599-20.65-12.386V48.846l11.178-5.894v6.577l-4.693 3.16v19.22l9.301 5.808V21.664A41.178 41.178 0 01145 21z"
        fill="#fff"
      /> */}
            {/* <path
        d="M145.171 103C122.551 103 104 84.644 104 62c0-18.47 12.228-34.087 29.011-39.217v5.688c-13.449 4.973-23.209 17.923-23.209 33.114v1.69c.171 19.375 16.06 34.463 35.411 34.6.832.016 1.657-.009 2.475-.07V37.827l.853-.854 20.905 12.215V75.24l-11.263 6.235v-5.552l5.12-3.502.341-19.39-9.557-5.979V102.02c-2.872.641-5.857.98-8.916.98z"
        stroke={color[0]}
      />
      <path
        d="M145 21c22.686 0 41.094 18.46 41 41.17.075 18.038-11.727 33.372-27.988 38.763v-5.58c13.097-5.424 22.455-17.211 22.635-32.078l.001-1.38c-.013-19.48-15.963-35.6-35.423-35.6-.576 0-1.149.015-1.718.042v60.86l-1.024.599-20.65-12.386V48.846l11.178-5.894v6.577l-4.693 3.16v19.22l9.301 5.808V21.664A41.178 41.178 0 01145 21z"
        stroke={color[0]}
      /> */}
            {/* <rect
        x={26.5}
        y={133.5}
        width={237}
        height={39}
        rx={19.5}
        stroke={color[0]}
      /> */}
            <rect
                x={61.5}
                y={264.5}
                width={168}
                height={35}
                rx={17.5}
                fill={color[0]}
                stroke={color[0]}
            />
            <rect
                x={26.5}
                y={184.5}
                width={237}
                height={39}
                rx={19.5}
                stroke={color[0]}
            />
            <foreignObject x="25.8908" y="153.228" width="238" height="40">
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                }}>
                    <p style={{
                        fontFamily: "Arial",
                        fontSize: 17,
                        fontWeight: 600,
                        textAlign: "center",
                        color: current.values.secondary_light
                    }}>
                        OTP CODE
                    </p>
                </div>
            </foreignObject>
            <foreignObject x="25.8908" y="262.228" width="238" height="40">
                <div
                    onClick={LoginAction}
                    style={{
                        height: "100%",
                        width: "70%",
                        margin: "0px auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        borderRadius: 20
                    }}>
                    <BtnAction>
                        {color[2].toString()}
                    </BtnAction>
                </div>
            </foreignObject>
            <foreignObject x="21.8908" y="184.228" width="250" height="40">
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <input type="password" placeholder="XXXXXX" maxLength={6} style={{
                        height: "96%",
                        padding: "unset",
                        border: "unset",
                        width: "96%",
                        borderRadius: 20,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 19,
                        color: color[1]
                    }} onChange={(ev) => setUserPass(ev.target.value)} onKeyUp={(event) => {
                        if (event.keyCode === 13) {
                            LoginAction()
                        }
                    }} />
                </div>
            </foreignObject>
        </animated.svg> :
            <animated.svg
                width={291}
                height={351}
                fill="none"
                className="draggable"
            >
                <rect
                    x={2}
                    y={2}
                    width={287}
                    height={347}
                    rx={13}
                    fill={current.values.secondary}
                    stroke={color[0]}
                    strokeWidth={3}
                    strokeLinejoin="round"
                />
                {/* {!showqrcode && <path
                    d="M145.171 103C122.551 103 104 84.644 104 62c0-18.47 12.228-34.087 29.011-39.217v5.688c-13.449 4.973-23.209 17.923-23.209 33.114v1.69c.171 19.375 16.06 34.463 35.411 34.6.832.016 1.657-.009 2.475-.07V37.827l.853-.854 20.905 12.215V75.24l-11.263 6.235v-5.552l5.12-3.502.341-19.39-9.557-5.979V102.02c-2.872.641-5.857.98-8.916.98z"
                    fill="#fff"
                />} */}
                {/* {!showqrcode && <path
                    d="M145 21c22.686 0 41.094 18.46 41 41.17.075 18.038-11.727 33.372-27.988 38.763v-5.58c13.097-5.424 22.455-17.211 22.635-32.078l.001-1.38c-.013-19.48-15.963-35.6-35.423-35.6-.576 0-1.149.015-1.718.042v60.86l-1.024.599-20.65-12.386V48.846l11.178-5.894v6.577l-4.693 3.16v19.22l9.301 5.808V21.664A41.178 41.178 0 01145 21z"
                    fill="#fff"
                />} */}
                {/* {!showqrcode && <path
          d="M145.171 103C122.551 103 104 84.644 104 62c0-18.47 12.228-34.087 29.011-39.217v5.688c-13.449 4.973-23.209 17.923-23.209 33.114v1.69c.171 19.375 16.06 34.463 35.411 34.6.832.016 1.657-.009 2.475-.07V37.827l.853-.854 20.905 12.215V75.24l-11.263 6.235v-5.552l5.12-3.502.341-19.39-9.557-5.979V102.02c-2.872.641-5.857.98-8.916.98z"
          stroke={color[0]}
        />} */}
                {
                    !showqrcode && <>
                        <svg x="93" y="40" width="100" height="100" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="18" y="18" width="988" height="988" rx="494" fill="white" />
                            <path d="M283.844 516.648H296.053L254.374 437.921H233.745L212.695 412.661V353.3H337.311L357.519 377.718V353.3H481.714L502.764 378.56V437.921H474.136L424.037 532.225L432.036 541.908V572.641C421.09 572.641 413.933 574.606 410.565 578.535C407.478 582.464 405.934 588.779 405.934 597.48V603.795C407.899 603.795 409.583 602.672 410.986 600.427L422.774 608.005L443.824 633.265C442.14 646.456 437.369 656.42 429.51 663.156C421.652 669.892 412.109 673.26 400.882 673.26C389.936 673.26 379.131 669.471 368.465 661.893C357.8 669.471 346.714 673.26 335.206 673.26C323.98 673.26 311.069 666.524 296.474 653.052C281.88 639.58 273.74 624.564 272.056 608.005L283.844 600.427C284.967 602.953 287.633 604.216 291.843 604.216C303.912 604.216 309.946 593.691 309.946 572.641H304.894L283.844 547.381V516.648ZM331.838 530.541C334.645 528.857 338.013 525.489 341.942 520.437H352.888C356.537 525.489 359.905 528.857 362.992 530.541C367.764 523.805 374.78 519.595 384.042 517.911L444.666 400.873H469.926V365.088H369.307V400.873H394.988L354.993 487.599H339.837L299.421 400.873H325.523V365.088H224.483V400.873H249.743L309.946 517.911C319.489 519.595 326.786 523.805 331.838 530.541ZM348.678 622.319C358.782 631.02 369.869 635.37 381.937 635.37C394.287 635.37 403.268 628.353 408.881 614.32C406.917 615.443 404.671 616.004 402.145 616.004C382.499 616.004 372.675 601.55 372.675 572.641C372.675 549.065 381.937 537.277 400.461 537.277V526.752C395.129 526.752 391.059 527.033 388.252 527.594C385.446 527.875 381.937 529.559 377.727 532.646C373.517 535.733 369.728 540.364 366.36 546.539C359.624 545.136 353.309 540.224 347.415 531.804C341.521 539.382 335.206 544.294 328.47 546.539C324.822 540.364 320.892 535.733 316.682 532.646C312.472 529.559 308.964 527.875 306.157 527.594C303.351 527.033 299.421 526.752 294.369 526.752V537.277C312.893 537.277 322.155 549.065 322.155 572.641C322.155 593.972 317.665 607.303 308.683 612.636C304.473 614.881 299.141 616.004 292.685 616.004L285.949 614.32C291.563 628.353 300.404 635.37 312.472 635.37C324.822 635.37 336.048 631.02 346.152 622.319H348.678ZM358.361 437.921H340.258L352.467 466.549L369.307 426.975L358.361 413.924V437.921Z" fill="red" />
                            <path d="M731.979 618.53C731.979 633.405 737.312 641.685 747.977 643.369V673.26C733.663 673.26 723.419 672.558 717.244 671.155C711.069 669.752 705.737 666.243 701.246 660.63C699.001 662.033 695.492 666.664 690.721 674.523L688.195 678.312H648.2C642.587 668.489 638.236 662.595 635.149 660.63C630.939 666.243 625.887 669.752 619.993 671.155C614.099 672.558 603.714 673.26 588.839 673.26L567.789 643.79V618.109C578.454 616.425 583.787 608.145 583.787 593.27C583.787 587.095 582.805 580.78 580.84 574.325C577.753 572.922 574.244 572.22 570.315 572.22L549.265 546.96V516.648H559.79L542.529 437.921H530.741L509.691 412.661V353.3H626.729L647.779 378.56V437.921H626.308L643.99 522.121L654.515 534.751V516.648H667.145L684.406 433.29L667.145 412.661V353.3H784.183L805.233 378.56V437.921H777.868L757.239 530.541L766.922 541.908V572.22C755.976 572.501 747.416 577.412 741.241 586.955C735.066 596.498 731.979 607.023 731.979 618.53ZM734.926 526.331C720.331 526.331 709.245 532.927 701.667 546.118C694.65 541.066 688.195 534.891 682.301 527.594H665.461V536.014C671.074 539.382 673.881 545.136 673.881 553.275C673.881 561.414 670.373 570.957 663.356 581.903C656.339 592.568 650.866 599.024 646.937 601.269C643.288 599.024 637.956 592.568 630.939 581.903C623.922 570.957 620.414 561.555 620.414 553.696C620.414 545.557 623.221 539.663 628.834 536.014V527.594H611.994C607.784 533.769 601.75 539.943 593.891 546.118C585.471 532.927 574.244 526.331 560.211 526.331V536.856C570.876 538.259 579.577 544.995 586.313 557.064C593.049 568.852 596.417 580.78 596.417 592.849C596.417 611.934 590.663 622.6 579.156 624.845V637.475C592.347 637.475 601.89 634.809 607.784 629.476C610.871 626.95 613.678 623.442 616.204 618.951C622.94 626.529 629.255 634.388 635.149 642.527H658.725L678.091 618.951C683.704 627.932 690.16 633.405 697.457 635.37C703.632 636.773 709.806 637.475 715.981 637.475V624.845C704.754 622.6 699.141 611.934 699.141 592.849C699.141 580.78 702.509 568.852 709.245 557.064C715.981 544.995 724.541 538.259 734.926 536.856V526.331ZM772.395 400.873V365.088H678.933V400.873H702.509L678.933 516.648H687.774C693.107 523.945 697.317 528.436 700.404 530.12C705.456 523.665 712.192 519.595 720.612 517.911L747.135 400.873H772.395ZM594.733 530.12C597.54 527.875 601.609 523.384 606.942 516.648H614.52L591.365 400.873H614.941V365.088H521.479V400.873H546.739L572.841 517.911C581.542 519.034 588.839 523.103 594.733 530.12Z" fill="red" />
                            <rect x="18" y="18" width="988" height="988" rx="494" stroke="red" strokeWidth="36" />
                        </svg>
                    </>
                }
                {/* {!showqrcode && <path
          d="M145 21c22.686 0 41.094 18.46 41 41.17.075 18.038-11.727 33.372-27.988 38.763v-5.58c13.097-5.424 22.455-17.211 22.635-32.078l.001-1.38c-.013-19.48-15.963-35.6-35.423-35.6-.576 0-1.149.015-1.718.042v60.86l-1.024.599-20.65-12.386V48.846l11.178-5.894v6.577l-4.693 3.16v19.22l9.301 5.808V21.664A41.178 41.178 0 01145 21z"
          stroke={color[0]}
        />} */}
                {showqrcode && <AnimatedRect
                    x={61.5}
                    y={63.5}
                    width={168}
                    height={35}
                    rx={17.5}
                    fill={color[0]}
                    stroke={color[0]}
                />}
                {showqrcode && <foreignObject x="25.8908" y="60.228" width="238" height="40">
                    <div
                        onClick={() => {
                            setshow(true)
                            setshowqrcode(false)
                        }}
                        style={{
                            height: "100%",
                            width: "70%",
                            margin: "0px auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            borderRadius: 20
                        }}>
                        <BtnAction>
                            {"Go Back"}
                        </BtnAction>
                    </div>
                </foreignObject>}
                {showqrcode && <foreignObject style={{ borderRadius: 20 }} x="41.8908" y="117.228" width="208" height="208">
                    <QRCode
                        value={QrUrl}
                        size={208}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"L"}
                        includeMargin={false}
                        renderAs={"canvas"}
                        imageSettings={{
                            src: Icon,
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                        }} />
                </foreignObject>}

                {!showqrcode && <foreignObject style={{ borderRadius: 20 }} x="15.8908" y="184.228" width="257" height="30">
                    <div style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                    }}>
                        <input placeholder="xxxxxxxxxxxxxxxxxxxxx" style={{
                            height: "96%",
                            padding: "unset",
                            border: "unset",
                            width: "100%",
                            borderRadius: 20,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 14,
                            color: color[1]
                        }} onChange={(ev) => setkey(ev.target.value)} />
                    </div>
                </foreignObject>}
                {!showqrcode && <AnimatedRect
                    x={61.5}
                    y={264.5}
                    width={168}
                    height={35}
                    rx={17.5}
                    fill={color[0]}
                    stroke={color[0]}
                />}
                {!showqrcode && <rect
                    x={16.5}
                    y={184.5}
                    width={257}
                    height={29}
                    rx={13.5}
                    stroke={color[0]}
                />}
                {!showqrcode && <foreignObject x="25.8908" y="262.228" width="238" height="40">
                    <div
                        onClick={keylog}
                        style={{
                            height: "100%",
                            width: "70%",
                            margin: "0px auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            borderRadius: 20
                        }}>
                        <BtnAction>
                            {color[2].toString()}
                        </BtnAction>
                    </div>
                </foreignObject>}

            </animated.svg>
    )
}
const BtnAction = styled.p`
    font-family:Arial;
    font-size:19px;
    color:white;
    margin-bottom:unset !important;
`;
const AnimatedRect = styled.rect`
    transition: all;
     transition-timing-function: ease-in-out;
     cursor:pointer;
    :hover{
     transform:scale(1.01);
    }
    :active{
      transform:scale(9.91);
    }
`;
const Login_ = React.memo(Login)
export default Login_;
