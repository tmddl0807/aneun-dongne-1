import React from "react";
import styled from "styled-components";
const Div = styled.div`
  display: flex;
  flex-direction: column;

  .loadingBox {
    margin-top: 40%;
  }
  .loadingBox h1 {
    text-align: center;
  }
  .loadingBox .circle {
    margin-left: auto;
    margin-right: auto;
    width: 10px;
    height: 10px;
    border: 10px solid #fff;
    border-top: 10px solid rgb(176, 233, 168);
    border-radius: 50em;
    transition: all 0.2s;
    animation-name: spinCircle;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes spinCircle {
    from {
      transform: translate(-50%, -50%) rotate(0);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;
function MapLoading() {
  return (
    <div>
      <Div>
        <div className="loadingBox">
          <div className="circle"></div>
        </div>
      </Div>
    </div>
  );
}

export default MapLoading;
