import styled from "styled-components";


export const AdminContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgb(248, 250, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Header = styled.div`
  width: 968px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2%;
`;

export const HelloNameContainer = styled.div`
  width: 250px;
  height: 36px;
  font-size: 24px;
  color: #000;
  font-weight: 600;
`;

export const StatisticsContainer = styled.div`
  width: 968px;
  height: 151px;
  margin-top: 40px;
  padding: 31px 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 30px;
`;

export const StatisticWrapper = styled.div`
  width: 218px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const TotalContainer = styled.div`
  width: 114px;
  height: 84px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
`;

export const StatisticTitle = styled.div`
  width: 114px;
  height: 21px;
  font-size: 14px;
  color: #acacac;
`;

export const StatisticNumber = styled.div`
  width: 87px;
  height: 32px;
  font-size: 32px;
  color: #333333;
`;

export const StatisticRaiseDrop = styled.div`
  height: 20px;
  width: auto;
  font-size: 14px;
  color: #292d32;
  & span {
    color: #00ac4f;
  }
`;
export const LinkMemberContainer = styled.div`
  width: 210px;
  height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const AllCustomsTitle = styled.div`
  width: 210px;
  height: 33px;
  font-size: 22px;
  font-weight: 600;
  color: #000;
`;
export const ActiveCustomsTitle = styled.div`
  width: 111px;
  height: 21px;
  font-size: 14px;
  color: #16c098;
`;

export const TitleSearchWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MembersStatisticsContainer = styled.div`
  margin-top: 40px;
  width: 968px;
  height: 587px;
  
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
`;

// Стили для заголовков таблицы
export const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
  color: #333;
`;

// Стили для ячеек таблицы
export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  color: #333;
`;

// Стили для строки таблицы
export const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

// Стили для статуса (Active/Inactive)
export const StatusActive = styled.span`
  color: green;
  font-weight: 500;
`;

export const StatusInactive = styled.span`
  color: red;
  font-weight: 500;
`;
