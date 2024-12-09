import React, { useState, memo } from "react";
import { useTrading } from "../../../hooks/useTrading";

const SpotOrderForm = ({ assetType, balances, currentPrice }) => {
  const { placeSpotOrder, isProcessing } = useTrading();
  const [formData, setFormData] = useState({
    market: { amount: "" },
    limit: { amount: "", price: "" },
  });

  const validateOrder = (data, type, positionType) => {
    const amount = parseFloat(data.amount);
    const price = type === "limit" ? parseFloat(data.price) : currentPrice;

    if (isNaN(amount) || amount <= 0) {
      throw new Error("Please enter a valid amount");
    }

    if (type === "limit" && (isNaN(price) || price <= 0)) {
      throw new Error("Please enter a valid price");
    }

    // Check balances
    if (positionType === "buy") {
      const totalCost = amount * price;
      if (totalCost > balances.spotUSDTBalance) {
        throw new Error("Insufficient USDT balance");
      }
    } else {
      const availableAmount = balances.spotBalances[assetType] || 0;
      if (amount > availableAmount) {
        throw new Error(`Insufficient ${assetType} balance`);
      }
    }

    return { amount, limitPrice: type === "limit" ? price : undefined };
  };

  const handleSubmit = async (type, positionType) => {
    if (isProcessing) return;

    try {
      const data = formData[type];
      const validatedData = validateOrder(data, type, positionType);

      await placeSpotOrder({
        spotAssetType: assetType,
        positionType,
        orderType: type,
        ...validatedData,
      });

      // Clear only amount after successful order
      setFormData((prev) => ({
        ...prev,
        [type]: { ...prev[type], amount: "" },
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleInputChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const getTotalCost = (type) => {
    const amount = parseFloat(formData[type].amount) || 0;
    const price =
      type === "limit"
        ? parseFloat(formData.limit.price) || currentPrice
        : currentPrice;
    return (amount * price).toFixed(2);
  };

  return (
    <div className="spot-order-form">
      <div className="market-order-section">
        <label className="order-type-label">Market: </label>
        <div className="input-group">
          <label>Amount:</label>
          <input
            type="number"
            value={formData.market.amount}
            onChange={(e) =>
              handleInputChange("market", "amount", e.target.value)
            }
            min="0"
            step="0.0001"
            className="amount-input"
          />
          <span className="unit-label">{assetType}</span>

          {formData.market.amount && (
            <span className="estimated-cost">
              ≈ {getTotalCost("market")} USDT
            </span>
          )}

          <button
            className="order-button buy"
            onClick={() => handleSubmit("market", "buy")}
            disabled={isProcessing}
          >
            Buy
          </button>
          <button
            className="order-button sell"
            onClick={() => handleSubmit("market", "sell")}
            disabled={isProcessing}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="limit-order-section">
        <label className="order-type-label">Limit: </label>
        <div className="input-group" style={{flexWrap: 'wrap'}}>
          <label>Amount:</label>
          <input
            type="number"
            value={formData.limit.amount}
            onChange={(e) =>
              handleInputChange("limit", "amount", e.target.value)
            }
            min="0"
            step="0.0001"
            className="amount-input"
          />
          <span className="unit-label">{assetType}</span>

          <label>Price:</label>
          <input
            type="number"
            value={formData.limit.price}
            onChange={(e) =>
              handleInputChange("limit", "price", e.target.value)
            }
            min="0"
            step="0.0001"
            placeholder={currentPrice?.toFixed(2)}
            className="price-input"
          />
          <span className="unit-label">USDT</span>

          {formData.limit.amount && (
            <span className="estimated-cost">
              ≈ {getTotalCost("limit")} USDT
            </span>
          )}
        </div>
        <div className="input-group" style={{float: "right"}}>
          <button
            className="order-button buy"
            onClick={() => handleSubmit("limit", "buy")}
            disabled={isProcessing}
          >
            Buy
          </button>
          <button
            className="order-button sell"
            onClick={() => handleSubmit("limit", "sell")}
            disabled={isProcessing}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="balance-info">
        <div className="balance-item">
          <span className="balance-label">Available USDT:</span>
          <span className="balance-value">
            {balances.spotUSDTBalance.toFixed(2)}
          </span>
        </div>
        <div className="balance-item">
          <span className="balance-label">Available {assetType}:</span>
          <span className="balance-value">
            {(balances.spotBalances[assetType] || 0).toFixed(8)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SpotOrderForm);
