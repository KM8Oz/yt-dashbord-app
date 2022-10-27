import React from "react";
import styled from "styled-components";

export default {
    title: "Statistics",
    Component: ({...props}:any)=>{
        const Wrapper = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 7px;
        gap: 4px;
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 1;
        `;
        return (
            <Wrapper>
                hello
            </Wrapper>
        )
    }
}