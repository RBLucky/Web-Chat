import fs from "fs/promises";
import path from "path";

export async function getContext(contextType = "store") {
  try {
    // Get context data from relevant files
    const contextFile = path.join(process.cwd(), "data", `${contextType}.json`);
    const data = await fs.readFile(contextFile, "utf8");
    const contextData = JSON.parse(data);

    // Format context based on its type
    switch (contextType) {
      case "store":
        return formatStoreContext(contextData);
      case "restaurant":
        return formatRestaurantContext(contextData);
      case "tech-support":
        return formatTechSupportContext(contextData);
      default:
        return JSON.stringify(contextData, null, 2);
    }
  } catch (error) {
    console.error(`Error loading context: ${error}`);
    return "";
  }
}

function formatStoreContext(storeData) {
  let context = "";

  // Format products section
  if (storeData.products && storeData.products.length > 0) {
    context += "## PRODUCTS\n";
    storeData.products.forEach((product) => {
      context += `- ${product.name}: ${product.description || ""}\n`;
      if (product.sizes) context += `  Sizes: ${product.sizes.join(", ")}\n`;
      if (product.colors) context += `  Colors: ${product.colors.join(", ")}\n`;
      context += `  Price: ${product.price || "N/A"}\n`;
      context += `  Availability: ${product.stock || "Unknown"}\n\n`;
    });
  }

  // Format store info section
  if (storeData.storeInfo) {
    context += "## STORE INFORMATION\n";
    const info = storeData.storeInfo;
    if (info.locations) {
      context += "### Locations:\n";
      info.locations.forEach((loc) => {
        context += `- ${loc.name}: ${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}\n`;
        if (loc.phone) context += `  Phone: ${loc.phone}\n`;
        if (loc.hours) context += `  Hours: ${loc.hours}\n`;
      });
    }

    if (info.policies) {
      context += "\n### Store Policies:\n";
      Object.entries(info.policies).forEach(([policy, details]) => {
        context += `- ${policy}: ${details}\n`;
      });
    }
  }

  // Add current promotions if available
  if (storeData.promotions && storeData.promotions.length > 0) {
    context += "\n## CURRENT PROMOTIONS\n";
    storeData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
  }

  return context;
}

function formatRestaurantContext(restaurantData) {
  let context = "";

  // Format menu section
  if (restaurantData.menu) {
    context += "## MENU\n";
    Object.entries(restaurantData.menu).forEach(([category, items]) => {
      context += `### ${category}\n`;
      items.forEach((item) => {
        context += `- ${item.name}: ${item.description || ""}\n`;
        context += `  Price: ${item.price}\n`;
        if (item.dietary)
          context += `  Dietary Info: ${item.dietary.join(", ")}\n`;
      });
      context += "\n";
    });
  }

  // Restaurant info
  if (restaurantData.info) {
    context += "## RESTAURANT INFORMATION\n";
    const info = restaurantData.info;
    if (info.location) context += `Location: ${info.location}\n`;
    if (info.hours) context += `Hours: ${info.hours}\n`;
    if (info.phone) context += `Phone: ${info.phone}\n`;
    if (info.reservations) context += `Reservations: ${info.reservations}\n`;
  }

  return context;
}

function formatTechSupportContext(supportData) {
  let context = "";

  // Format common issues and solutions
  if (supportData.commonIssues) {
    context += "## COMMON ISSUES AND SOLUTIONS\n";
    supportData.commonIssues.forEach((issue) => {
      context += `### ${issue.problem}\n`;
      context += `${issue.description}\n\n`;
      context += "Solutions:\n";
      issue.solutions.forEach((solution, index) => {
        context += `${index + 1}. ${solution}\n`;
      });
      context += "\n";
    });
  }

  // Format product specifications
  if (supportData.products) {
    context += "## PRODUCT SPECIFICATIONS\n";
    supportData.products.forEach((product) => {
      context += `### ${product.name}\n`;
      context += `Model: ${product.model}\n`;
      if (product.specs) {
        context += "Specifications:\n";
        Object.entries(product.specs).forEach(([key, value]) => {
          context += `- ${key}: ${value}\n`;
        });
      }
      context += "\n";
    });
  }

  return context;
}
