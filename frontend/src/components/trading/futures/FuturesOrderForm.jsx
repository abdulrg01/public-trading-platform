import React, { useState, memo } from "react";
import { useTrading } from "../../../hooks/useTrading";

const FuturesOrderForm = ({ assetType, balance }) => {
  const { placeFuturesOrder, isProcessing, futuresCurrentPrices } =
    useTrading();
  const [formData, setFormData] = useState({
    market: { amount: "", leverage: "1" },
    limit: { amount: "", leverage: "1", limitPrice: "" },
  });

  const currentPrice =
    futuresCurrentPrices.find((p) => p.assetType === assetType)?.price || 0;

  const validateOrder = (data, type) => {
    const amount = parseFloat(data.amount);
    const leverage = parseFloat(data.leverage);
    const limitPrice =
      type === "limit" ? parseFloat(data.limitPrice) : undefined;

    if (isNaN(amount) || amount <= 0) {
      throw new Error("Please enter a valid amount");
    }

    if (amount > balance) {
      throw new Error("Insufficient balance");
    }

    if (isNaN(leverage) || leverage < 1 || leverage > 300) {
      throw new Error("Leverage must be between 1 and 300");
    }

    if (type === "limit" && (isNaN(limitPrice) || limitPrice <= 0)) {
      throw new Error("Please enter a valid limit price");
    }

    return { amount, leverage, limitPrice };
  };

  const handleSubmit = async (type, positionType) => {
    if (isProcessing) return;

    try {
      const data = formData[type];
      const validatedData = validateOrder(data, type);

      await placeFuturesOrder({
        futuresAssetType: assetType,
        positionType: positionType === "long" ? "Long" : "Short",
        orderType: type,
        ...validatedData,
      });

      // Only clear amount after successful order
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

  return (
    <div className="futures-order-form">
      <div
        className="market-order-section"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label className="order-type-label">Market Order</label>
        <div className="input-group">
          <label>Margin</label>
          <span className="unit-label">(USDT)</span>
          <input
            type="number"
            value={formData.market.amount}
            onChange={(e) =>
              handleInputChange("market", "amount", e.target.value)
            }
            min="1"
            className="amount-input"
          />

          <label>Leverage</label>
          <input
            type="number"
            value={formData.market.leverage}
            onChange={(e) =>
              handleInputChange("market", "leverage", e.target.value)
            }
            min="1"
            max="300"
            className="leverage-input"
          />
        </div>
        <div className="input-group" style={{float: "right"}}>
          <button
            className="order-button long"
            onClick={() => handleSubmit("market", "long")}
            disabled={isProcessing}
          >
            Long
          </button>
          <button
            className="order-button short"
            onClick={() => handleSubmit("market", "short")}
            disabled={isProcessing}
          >
            Short
          </button>
        </div>
      </div>

      <div className="limit-order-section">
        <label className="order-type-label">Limit Order</label>
        <div className="input-group">
          <label>Margin</label>
          <span className="unit-label">(USDT)</span>
          <input
            type="number"
            value={formData.limit.amount}
            onChange={(e) =>
              handleInputChange("limit", "amount", e.target.value)
            }
            min="1"
            className="amount-input"
          />

          <label>Leverage:</label>
          <input
            type="number"
            value={formData.limit.leverage}
            onChange={(e) =>
              handleInputChange("limit", "leverage", e.target.value)
            }
            min="1"
            max="300"
            className="leverage-input"
          />
        </div>
        <div className="input-group" style={{ float: "right" }}>
          <label>Limit Price </label>
          <span className="unit-label">(USDT)</span>
          <input
            type="number"
            value={formData.limit.limitPrice}
            onChange={(e) =>
              handleInputChange("limit", "limitPrice", e.target.value)
            }
            placeholder={currentPrice.toFixed(2)}
            className="price-input"
          />

          <button
            className="order-button long"
            onClick={() => handleSubmit("limit", "long")}
            disabled={isProcessing}
          >
            Long
          </button>
          <button
            className="order-button short"
            onClick={() => handleSubmit("limit", "short")}
            disabled={isProcessing}
          >
            Short
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FuturesOrderForm);
