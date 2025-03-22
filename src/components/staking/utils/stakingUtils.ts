
/**
 * Helper function to assign colors based on token category
 * @param category The token category
 * @returns The color class for the category
 */
export function getCategoryColor(category: string): string {
  switch (category) {
    case "Real Estate":
      return "blue-500";
    case "Entertainment":
      return "green-500";
    case "Commodity":
      return "amber-500";
    case "Private Credit":
      return "red-500";
    case "Native Token":
      return "indigo-500";
    default:
      return "purple-500";
  }
}

/**
 * Calculate yield statistics for staked tokens
 * @param totalStakedValue Total value of staked tokens
 * @returns Object containing yield statistics
 */
export function calculateYieldStats(totalStakedValue: number) {
  // Estimate primary yield (from rental income)
  const primaryYield = 0.07; // 7% average
  const annualPrimaryYield = totalStakedValue * primaryYield;
  
  // Estimate secondary yield (from reinvested income)
  const secondaryYield = 0.12; // 12% average from reinvestment
  const annualSecondaryYield = annualPrimaryYield * secondaryYield;
  
  // Total combined yield
  const totalAnnualYield = annualPrimaryYield + annualSecondaryYield;
  const combinedYieldRate = totalStakedValue > 0 ? (totalAnnualYield / totalStakedValue) * 100 : 0;

  return {
    primaryYield,
    annualPrimaryYield,
    secondaryYield,
    annualSecondaryYield,
    totalAnnualYield,
    combinedYieldRate
  };
}

/**
 * Calculate breakdown of staked assets by category
 * @param stakedTokens Array of staked tokens
 * @param totalStakedValue Total value of staked tokens
 * @returns Array of categories with percentages and colors
 */
export function calculateCategoryBreakdown(stakedTokens: any[], totalStakedValue: number) {
  // Calculate breakdown of staked assets by category
  const categoryBreakdown: Record<string, { value: number, percentage: number }> = {};
  
  stakedTokens.forEach(token => {
    const category = token.category;
    const value = token.price * token.balance;
    
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { value: 0, percentage: 0 };
    }
    
    categoryBreakdown[category].value += value;
  });
  
  // Calculate percentages
  if (totalStakedValue > 0) {
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].percentage = (categoryBreakdown[category].value / totalStakedValue) * 100;
    });
  }
  
  // Sort categories by value (descending)
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b.value - a.value)
    .map(([category, data]) => ({ 
      category, 
      percentage: data.percentage,
      color: getCategoryColor(category)
    }));
  
  // If there are more than 4 categories, add an "Other" category
  if (sortedCategories.length > 4) {
    const topCategories = sortedCategories.slice(0, 3);
    const otherPercentage = sortedCategories.slice(3).reduce((sum, item) => sum + item.percentage, 0);
    
    topCategories.push({
      category: "Other RWAs",
      percentage: otherPercentage,
      color: "purple-500"
    });
    
    return topCategories;
  }
  
  return sortedCategories;
}
