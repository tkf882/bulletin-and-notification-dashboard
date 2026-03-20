export interface posts {
  pid:number; 
  user_id:number;
  username:string;
  title:string;
  content:string;
  tags:string;
  date:string;
  status:number;  // 0, 1
  parent:(number | null);
}