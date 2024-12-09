import React, { memo } from "react";
import { useTrading } from "../../../contexts/TradingContext";
import AssetSelector from "../../common/AssetSelector/AssetSelecter";
import TradingViewWidget from "../../common/Chart/TradingViewWidget";
import SpotOrderForm from "./SpotOrderForm";
import SpotPositions from "./SpotPositions";
import SpotStatistics from "./SpotStatistics";
import PriceTicker from "../../common/PriceTicker/PriceTicker";
import "./styles.css";
import { useAuth } from "../../../contexts/AuthContext";

const SpotTrading = () => {
  const { spotAssetType, setSpotAssetType, spotCurrentPrices, balances } =
    useTrading();
  const { isAuthenticated } = useAuth();
  return (
    <div id="spot" className="trading-panel">
      {isAuthenticated && <SpotStatistics />}

      <div id="spot-now-price" className="price-ticker app-container">
        {spotCurrentPrices.map((price) => (
          <PriceTicker key={price.assetType} price={price} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
        <div
          style={{
            width: "2%",
            margin: "5px 0",
            backgroundColor: "#16171a",
            borderRadius: "4px",
          }}
        ></div>
        <div className="order-header" style={{ flexBasis: "25%" }}>
          <AssetSelector
            type="spot"
            selectedAsset={spotAssetType}
            onAssetSelect={setSpotAssetType}
            currentPrices={spotCurrentPrices}
            dropdownId="spot-dropdownSelected"
            optionsId="spot-dropdownOptions"
          />
          <div id="spot-assets-statistics" className="asset-statistics" />
        </div>
        <div
          style={{
            width: "78%",
            margin: "5px 0",
            backgroundColor: "#16171a",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      <div className="app-container" style={{ display: "flex", gap: "5px" }}>
        <div className="chart-container">
          <TradingViewWidget
            symbol={`${spotAssetType}USDT`}
            id={`chart_${spotAssetType.toLowerCase()}`}
          />
        </div>
        <div className="order-panel">
          {isAuthenticated && (
            <SpotOrderForm
              assetType={spotAssetType}
              balances={balances}
              currentPrice={
                spotCurrentPrices.find((p) => p.assetType === spotAssetType)
                  ?.price
              }
            />
          )}
        </div>
      </div>
      <SpotPositions />
    </div>
  );
};

export default memo(SpotTrading);
