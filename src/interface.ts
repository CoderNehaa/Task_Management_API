interface AccountType{
    admin:"Admin",
    user:"User"
}

interface Priority{
    high:"high",
    medium:"medium",
    low:"low"
}

interface Status{
    todo:"To do",
    inProgress:"In Progress",
    done:"Done"
}

interface User{
    id:number,
    username:string,
    password:string,
    accountType:AccountType,
    adminId:number
}

export interface Task{
    id?:number,
    title:string,
    description?:string,
    status:Status,
    priority:Priority,
    startDate?:Date,
    updateDate?:Date,
    endDate?:Date,
    creatorId:number,
    assigneeId?:number
}


