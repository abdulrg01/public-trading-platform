import React, { memo } from "react";
import {
  SpotUSDTBalance,
  SpotValueBalance,
  TotalUSDTBalance,
  TotalValueBalance,
  AssetBalances,
} from "../../common/Balances/Balances";

const SpotStatistics = () => {
  return (
    <>
      <div className="total-statistics app-container">
        <TotalUSDTBalance />
        <TotalValueBalance />
      </div>
      <div className="spot-statistics app-container">
        <SpotUSDTBalance />
        <SpotValueBalance />
        <AssetBalances />
      </div>
    </>
  );
};

export default memo(SpotStatistics);
