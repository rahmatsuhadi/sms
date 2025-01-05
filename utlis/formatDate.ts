export function formatDateTimeToIndo(dateString:string) {    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
  
    return `${formattedDate}, ${formattedTime}`;
  }