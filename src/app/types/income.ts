export interface Income{
    source: string;
    amount: number,
    title: string,    
}

export interface IncomeResponse{
    source: string;
    amount: number,
    title: string,   
    docId: string 
}