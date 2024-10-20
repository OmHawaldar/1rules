export interface Node {
  type: 'operator' | 'operand';
  left?: Node;
  right?: Node;
  value?: string | number;
  operator?: string;
  attribute?: string;
}

export interface UserData {
  age: number;
  department: string;
  salary: number;
  experience: number;
  [key: string]: string | number;
}