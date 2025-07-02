import { View } from "@/components/view";
import ProductDisplay from "./product-display";

export default function StockControlProduct() {
  return (
    <View.Vertical className="h-screen">
      <View.Scroll>
        <ProductDisplay/>
      </View.Scroll>
    </View.Vertical>
  )
}