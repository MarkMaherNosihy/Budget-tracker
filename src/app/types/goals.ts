export interface Goals{
    priority: number,
    amount: number,
    savedAmount: number,
    title: string, 
    progress: number   
}

export interface GoalsResponse{
    priority: number,
    amount: number,
    savedAmount: number,
    title: string,    
    docId: string,
    progress?: number   

}