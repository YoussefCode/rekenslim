interface FractionDisplayProps {
  text: string;
}

const FractionDisplay = ({ text }: FractionDisplayProps) => {
  // Convert text like "3/4" to proper fraction display
  const formatFraction = (input: string) => {
    // First remove curly braces around fractions
    let cleanedInput = input.replace(/\{(\d+\/\d+)\}/g, '$1');
    
    // Then replace fraction patterns like "3/4" with formatted fraction
    return cleanedInput.replace(/(\d+)\/(\d+)/g, (match, numerator, denominator) => {
      return `<span class="fraction">
        <span class="numerator">${numerator}</span>
        <span class="denominator">${denominator}</span>
      </span>`;
    });
  };

  return (
    <div 
      className="fraction-container"
      dangerouslySetInnerHTML={{ __html: formatFraction(text) }}
    />
  );
};

export default FractionDisplay;