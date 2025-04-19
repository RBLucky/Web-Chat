import fs from "fs/promises";
import path from "path";

export async function getContext(contextType = "store") {
  try {
    // Map contextType to corresponding file names if they differ from the context type
    const contextFileMap = {
      "store": "store.json",
      "restaurant": "restaurant.json",
      "tech-support": "techSupport.json",
      "photographer": "photographer.json",
      "illustratorAnimator": "illustratorAnimator.json",
      "aiSoftwareDev": "aiDev.json",
      "tattooArtist": "tattoo.json"
    };
    
    // Get the correct filename based on context type
    const filename = contextFileMap[contextType] || `${contextType}.json`;
    const contextFile = path.join(process.cwd(), "data", filename);
    
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
      case "photographer":
        return formatPhotographerContext(contextData);
      case "illustratorAnimator":
        return formatIllustratorAnimatorContext(contextData);
      case "aiSoftwareDev":
        return formatAISoftwareDevContext(contextData);
      case "tattooArtist":
        return formatTattooArtistContext(contextData);
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
        context += `- ${loc.name}: ${loc.address}, ${loc.city || ""}, ${loc.province || loc.state || ""} ${loc.zip || loc.postal_code || ""}\n`;
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
    restaurantData.menu.forEach((item) => {
      context += `- ${item.name}: ${item.description || ""}\n`;
      context += `  Price: ${item.price}\n`;
      if (item.availability) context += `  Availability: ${item.availability}\n`;
      if (item.dietary) context += `  Dietary Info: ${item.dietary.join(", ")}\n`;
      context += "\n";
    });
  }

  // Restaurant info
  if (restaurantData.storeInfo) {
    context += "## RESTAURANT INFORMATION\n";
    const info = restaurantData.storeInfo;
    if (info.locations) {
      context += "### Locations:\n";
      info.locations.forEach((loc) => {
        context += `- ${loc.name}: ${loc.address}, ${loc.city}, ${loc.province} ${loc.postal_code || ""}\n`;
        if (loc.phone) context += `  Phone: ${loc.phone}\n`;
        if (loc.hours) context += `  Hours: ${loc.hours}\n`;
      });
    }

    if (info.policies) {
      context += "\n### Restaurant Policies:\n";
      Object.entries(info.policies).forEach(([policy, details]) => {
        context += `- ${policy}: ${details}\n`;
      });
    }
  }

  // Add current promotions if available
  if (restaurantData.promotions && restaurantData.promotions.length > 0) {
    context += "\n## CURRENT PROMOTIONS\n";
    restaurantData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
  }

  return context;
}

function formatTechSupportContext(supportData) {
  let context = "";

  // Format services section
  if (supportData.services && supportData.services.length > 0) {
    context += "## TECH SUPPORT SERVICES\n";
    supportData.services.forEach((service) => {
      context += `- ${service.name}: ${service.description || ""}\n`;
      context += `  Price Range: ${service.priceRange || "N/A"}\n`;
      if (service.brands) context += `  Supported Brands: ${service.brands.join(", ")}\n`;
      context += "\n";
    });
  }

  // Format store info section
  if (supportData.storeInfo) {
    context += "## STORE INFORMATION\n";
    const info = supportData.storeInfo;
    if (info.locations) {
      context += "### Locations:\n";
      info.locations.forEach((loc) => {
        context += `- ${loc.name}: ${loc.address}, ${loc.city}, ${loc.province} ${loc["postal code"] || ""}\n`;
        if (loc.phone) context += `  Phone: ${loc.phone}\n`;
        if (loc.hours) context += `  Hours: ${loc.hours}\n`;
      });
    }

    if (info.policies) {
      context += "\n### Support Policies:\n";
      Object.entries(info.policies).forEach(([policy, details]) => {
        context += `- ${policy}: ${details}\n`;
      });
    }
  }

  // Add current promotions if available
  if (supportData.promotions && supportData.promotions.length > 0) {
    context += "\n## CURRENT PROMOTIONS\n";
    supportData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
  }

  return context;
}

function formatPhotographerContext(photographerData) {
  let context = "";

  // Format services section
  if (photographerData.services && photographerData.services.length > 0) {
    context += "## PHOTOGRAPHY SERVICES\n";
    photographerData.services.forEach((service) => {
      context += `- ${service.name}: ${service.description || ""}\n`;
      if (service.price) context += `  Price: ${service.price}\n`;
      if (service.priceRange) context += `  Price Range: ${service.priceRange}\n`;
      if (service.includes) context += `  Includes: ${service.includes}\n`;
      if (service.bookingNotice) context += `  Booking Notice: ${service.bookingNotice}\n`;
      context += "\n";
    });
  }

  // Format studio info section
  if (photographerData.storeInfo) {
    context += "## STUDIO INFORMATION\n";
    const info = photographerData.storeInfo;
    if (info.locations) {
      context += "### Locations:\n";
      info.locations.forEach((loc) => {
        context += `- ${loc.name}: ${loc.address}, ${loc.city}, ${loc.province} ${loc["postal code"] || ""}\n`;
        if (loc.phone) context += `  Phone: ${loc.phone}\n`;
        if (loc.hours) context += `  Hours: ${loc.hours}\n`;
      });
    }

    if (info.policies) {
      context += "\n### Photographer Policies:\n";
      Object.entries(info.policies).forEach(([policy, details]) => {
        context += `- ${policy}: ${details}\n`;
      });
    }
  }

  // Add current promotions if available
  if (photographerData.promotions && photographerData.promotions.length > 0) {
    context += "\n## CURRENT PROMOTIONS\n";
    photographerData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
  }

  return context;
}

function formatIllustratorAnimatorContext(illustratorData) {
  let context = "";

  // Format services section
  if (illustratorData.services && illustratorData.services.length > 0) {
    context += "## ILLUSTRATION & ANIMATION SERVICES\n";
    illustratorData.services.forEach((service) => {
      context += `- ${service.name}: ${service.description || ""}\n`;
      if (service.price) context += `  Price: ${service.price}\n`;
      if (service.packages && service.packages.length > 0) {
        context += `  Packages: ${service.packages.join(", ")}\n`;
      }
      if (service.delivery) context += `  Delivery Time: ${service.delivery}\n`;
      context += "\n";
    });
  }

  // Format studio info section
  if (illustratorData.storeInfo) {
    context += "## STUDIO INFORMATION\n";
    const info = illustratorData.storeInfo;
    if (info.locations) {
      context += "### Locations:\n";
      info.locations.forEach((loc) => {
        context += `- ${loc.name}: ${loc.address}\n`;
        if (loc.email) context += `  Email: ${loc.email}\n`;
        if (loc.phone) context += `  Phone: ${loc.phone}\n`;
        if (loc.hours) context += `  Hours: ${loc.hours}\n`;
      });
    }

    if (info.policies) {
      context += "\n### Studio Policies:\n";
      Object.entries(info.policies).forEach(([policy, details]) => {
        context += `- ${policy}: ${details}\n`;
      });
    }
  }

  // Add current promotions if available
  if (illustratorData.promotions && illustratorData.promotions.length > 0) {
    context += "\n## CURRENT PROMOTIONS\n";
    illustratorData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
  }

  return context;
}

function formatAISoftwareDevContext(aiDevData) {
  let context = "";

  // Format services section
  if (aiDevData.services && aiDevData.services.length > 0) {
    context += "## AI DEVELOPMENT SERVICES\n";
    aiDevData.services.forEach((service) => {
      context += `- ${service.name}: ${service.description || ""}\n`;
      if (service.priceRange) context += `  Price Range: ${service.priceRange}\n`;
      context += "\n";
    });
  }

  // Format company info section
  if (aiDevData.storeInfo) {
    context += "## COMPANY INFORMATION\n";
    const info = aiDevData.storeInfo;
    if (info.locations) {
      context += "### Location:\n";
      info.locations.forEach((loc) => {
        context += `- ${loc.name}: ${loc.address}\n`;
        if (loc.email) context += `  Email: ${loc.email}\n`;
        if (loc.phone) context += `  Phone: ${loc.phone}\n`;
        if (loc.hours) context += `  Hours: ${loc.hours}\n`;
      });
    }

    if (info.policies) {
      context += "\n### Business Policies:\n";
      Object.entries(info.policies).forEach(([policy, details]) => {
        context += `- ${policy}: ${details}\n`;
      });
    }
  }

  // Add current promotions if available
  if (aiDevData.promotions && aiDevData.promotions.length > 0) {
    context += "\n## CURRENT PROMOTIONS\n";
    aiDevData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
  }

  return context;
}

function formatTattooArtistContext(tattooData) {
  let context = "";

  // Format artist info section
  if (tattooData.artistInfo) {
    context += "## ARTIST INFORMATION\n";
    const info = tattooData.artistInfo;
    context += `### ${info.name}\n`;
    if (info.owner) context += `Owner: ${info.owner}\n`;
    if (info.experience) context += `Experience: ${info.experience}\n`;
    if (info.bio) context += `Bio: ${info.bio}\n`;
    if (info.styleSpecialties && info.styleSpecialties.length > 0) {
      context += `Style Specialties: ${info.styleSpecialties.join(", ")}\n`;
    }
    context += "\n";
  }

  // Format designs section
  if (tattooData.designs && tattooData.designs.length > 0) {
    context += "## TATTOO DESIGNS\n";
    tattooData.designs.forEach((design) => {
      context += `- ${design.name}: ${design.description || ""}\n`;
      if (design.category) context += `  Style: ${design.category}\n`;
      if (design.priceRange) context += `  Price Range: ${design.priceRange}\n`;
      if (design.estimatedTime) context += `  Estimated Time: ${design.estimatedTime}\n`;
      context += "\n";
    });
  }

  // Format studio location
  if (tattooData.studioLocation) {
    context += "## STUDIO LOCATION\n";
    const loc = tattooData.studioLocation;
    context += `- ${loc.name}: ${loc.address}, ${loc.suburb}, ${loc.city}, ${loc.province} ${loc.postalCode || ""}\n`;
    if (loc.phone) context += `  Phone: ${loc.phone}\n`;
    if (loc.whatsapp) context += `  WhatsApp: ${loc.whatsapp}\n`;
    if (loc.email) context += `  Email: ${loc.email}\n`;
  }

  // Format appointment availability
  if (tattooData.appointmentAvailability) {
    context += "\n## APPOINTMENT INFORMATION\n";
    const appt = tattooData.appointmentAvailability;
    if (appt.days) context += `Days Available: ${appt.days.join(", ")}\n`;
    if (appt.hours) context += `Hours: ${appt.hours}\n`;
    
    if (appt.bookingOptions) {
      const bookOpt = appt.bookingOptions;
      context += "Booking Options:\n";
      if (bookOpt.walkIns) context += `- Walk-ins: ${bookOpt.walkIns}\n`;
      if (bookOpt.appointments) context += `- Appointments: ${bookOpt.appointments}\n`;
      if (bookOpt.bookingLink) context += `- Online Booking: ${bookOpt.bookingLink}\n`;
    }
    context += "\n";
  }

  // Format shop policies
  if (tattooData.shopPolicies) {
    context += "## STUDIO POLICIES\n";
    Object.entries(tattooData.shopPolicies).forEach(([policy, details]) => {
      context += `- ${policy}: ${details}\n`;
    });
    context += "\n";
  }

  // Add current promotions if available
  if (tattooData.promotions && tattooData.promotions.length > 0) {
    context += "## CURRENT PROMOTIONS\n";
    tattooData.promotions.forEach((promo) => {
      context += `- ${promo.name}: ${promo.description}\n`;
      if (promo.code) context += `  Code: ${promo.code}\n`;
      if (promo.expiry) context += `  Valid until: ${promo.expiry}\n`;
    });
    context += "\n";
  }

  // Format testimonials
  if (tattooData.testimonials && tattooData.testimonials.length > 0) {
    context += "## CLIENT TESTIMONIALS\n";
    tattooData.testimonials.forEach((testimonial) => {
      context += `- ${testimonial.name} (${testimonial.rating}/5): "${testimonial.comment}"\n`;
    });
  }

  return context;
}