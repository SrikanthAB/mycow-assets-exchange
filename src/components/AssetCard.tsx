
import { useState } from "react";
import SharedAssetCard, { AssetCardProps as SharedAssetCardProps } from "./shared/AssetCard";

interface AssetCardProps {
  name: string;
  symbol: string;
  image: string; 
  price: string;
  change: number;
  category: string;
  yield?: string;
  onBuy?: () => void;
  locked?: boolean;
}

const AssetCard = ({ name, symbol, image, price, change, category, yield: yieldValue, onBuy, locked }: AssetCardProps) => {
  return (
    <SharedAssetCard
      name={name}
      symbol={symbol}
      image={image}
      price={price}
      change={change}
      category={category}
      yield={yieldValue}
      locked={locked}
      onBuy={onBuy}
      showBalance={false}
    />
  );
};

export default AssetCard;
