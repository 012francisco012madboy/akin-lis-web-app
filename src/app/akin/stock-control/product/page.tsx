import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { View } from "@/components/view";
import ProductDisplay from "./product-display";

const breadcrumbItems = [
  {
    label: "Produtos",
  }
]

export default function StockControlProduct() {
  return (
    <View.Vertical className="h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      <View.Scroll>
        <ProductDisplay/>
      </View.Scroll>
    </View.Vertical>
  )
}