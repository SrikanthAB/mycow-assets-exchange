
import React, { useState } from "react";
import { Token } from "@/contexts/portfolio/types";
import SellAssetModal from "./SellAssetModal";
import SharedAssetCard from "@/components/shared/AssetCard";

interface AssetCardProps {
  token: Token;
}

const AssetCard = ({ token }: AssetCardProps) => {
  const [sellModalOpen, setSellModalOpen] = useState(false);
  
  const openSellModal = () => {
    setSellModalOpen(true);
  };
  
  const closeSellModal = () => {
    setSellModalOpen(false);
  };

  return (
    <>
      <SharedAssetCard
        id={token.id}
        name={token.name}
        symbol={token.symbol}
        image={token.image}
        price={token.price}
        change={token.change}
        category={token.category}
        yield={token.yield}
        balance={token.balance}
        locked={token.locked}
        lockedAmount={token.lockedAmount}
        loanId={token.loanId}
        onSell={openSellModal}
        showBalance={true}
      />
      
      {/* Sell Asset Modal */}
      <SellAssetModal 
        isOpen={sellModalOpen} 
        onClose={closeSellModal} 
        token={token} 
      />
    </>
  );
};

export default AssetCard;
