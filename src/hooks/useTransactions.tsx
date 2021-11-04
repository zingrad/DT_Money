import { type } from "os";
import { createContext, useState,useEffect, ReactNode, useContext  } from "react"
import { api } from "../services/api";


interface Transaction{
    id:number;
    title:string;
    amount:number;
    type:string;
    category:string;
    createdAt:string;
}

//forma normal de tipar
// interface TransactionInput{
//     title:string;
//     amount:number;
//     type:string;
//     category:string;
// }

//dessa forma pega todas as tipagens de Transaction menos ID e CreatedAT
type TransactionInput = Omit<Transaction,"id" | "createdAt">

//dessa forma vai herdar apenas as  tipagens que voce escolher de Transaction
// type Transactioninput = Pick<Transaction,"title" | "amount" | "type" | "category">

interface TransactionsProviderProps {
    children: ReactNode;
    
}

interface TransactionsContextData{
    transactions: Transaction[];
    createTransaction: (Transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData // qiando der esse erro de objeto ou array enganar 
                                //o Typescript
    
    )

 export function TransactionsProvider({children} : TransactionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api
          .get("transactions")
          .then((response) => setTransactions(response.data.transactions));
      }, []);

    async  function createTransaction(transactionInput : TransactionInput){

       
    const response =  await  api.post('/transactions',{
        ...transactionInput,
        createdAt: new Date()
    })
    const { transaction} = response.data

    setTransactions([
        ...transactions,
        transaction
    ])


      }

     return(
         <TransactionsContext.Provider value={{transactions, createTransaction }}>
             {children}
         </TransactionsContext.Provider>
     )
}

export function useTransactions() {
    const context = useContext(TransactionsContext)

    return context;
}