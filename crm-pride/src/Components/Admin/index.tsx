import React, { useEffect, useState } from "react";
import {
  ActiveCustomsTitle,
  AdminContainer,
  AllCustomsTitle,
  Header,
  HelloNameContainer,
  LinkMemberContainer,
  MembersStatisticsContainer,
  StatisticNumber,
  StatisticRaiseDrop,
  StatisticsContainer,
  StatisticTitle,
  StatisticWrapper,
  StatusActive,
  StatusInactive,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TitleSearchWrapper,
  TotalContainer,
} from "./styles";
import SearchBar from "../SearchField";

import img1 from "../../assets/1_for_statistics.png";
import img2 from "../../assets/2_for_statistics.png";
import img3 from "../../assets/3_for_statistics.png";
import Menu from "../Menu";
import { UserModal } from "./ModalProfile";
import { Me, User } from "@/types";
import { API_BASE_URL } from "../../api";
import axios from "axios";
import { Navigate } from "react-router";

const data = [
  {
    src: img1,
    title: "Пользователи",
    number: "5,423",
    raisedrop: " в этом месяце",
    persentage: "↑ 18%",
  },
  {
    src: img2,
    title: "Участники",
    number: "1,893",
    raisedrop: " в этом месяце",
    persentage: "↑ 1%",
  },
  {
    src: img3,
    title: "Активные",
    number: "189",
    raisedrop: " в этот день",
    persentage: "↑ 18%",
  },
];

export default function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>();
  const [pressedActiveButton, setPressedActiveButton] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<Me>();

  useEffect(() => {
    // Логика получения токена
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    if (t) {
      localStorage.setItem("auth_token", t);
      setToken(t);
      window.history.replaceState(
        {},
        document.title,
        window.location.origin + window.location.pathname
      );
    } else {
      const saved = localStorage.getItem("auth_token");
      if (saved) setToken(saved);
    }
  }, []);

  useEffect(() => {
    // Логика запроса данных когда токен доступен
    const fetchUsers = async () => {
      if (!token) {
        <Navigate to="/auth" />;
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}admin/users/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const me = await axios.get(`${API_BASE_URL}me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setMe(me.data);
        setUsers(response.data);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Токен истек
          localStorage.removeItem("auth_token");
          <Navigate to="/auth" />;
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]); // Зависимость от token
  useEffect(() => {
    let result: User[] = users || [];
    if (pressedActiveButton) {
      result = result && result.filter((user) => user.status === true);
    }

    if (searchTerm) {
      result =
        result &&
        result.filter((user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    setFilteredUsers(result);
  }, [pressedActiveButton, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleActive = () => {
    setPressedActiveButton(!pressedActiveButton);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  return (
    <AdminContainer>
      <Menu></Menu>
      <Header>
        <HelloNameContainer>Привет, {me?.username}</HelloNameContainer>
      </Header>
      <StatisticsContainer>
        {data.map((item, index) => (
          <StatisticWrapper key={index}>
            <img src={item.src} />
            <TotalContainer>
              <StatisticTitle>{item.title}</StatisticTitle>
              <StatisticNumber>{item.number}</StatisticNumber>
              <StatisticRaiseDrop>
                <span>{item.persentage}</span>
                {item.raisedrop}
              </StatisticRaiseDrop>
            </TotalContainer>
          </StatisticWrapper>
        ))}
      </StatisticsContainer>
      <StatisticsContainer
        style={{
          flexDirection: "column",
          height: "auto",
        }}
      >
        <TitleSearchWrapper>
          <LinkMemberContainer>
            <AllCustomsTitle>Все пользователи</AllCustomsTitle>
            <ActiveCustomsTitle
              style={{ cursor: "pointer" }}
              onClick={handleActive}
            >
              Активные
            </ActiveCustomsTitle>
          </LinkMemberContainer>
          <SearchBar onSearch={handleSearch}></SearchBar>
        </TitleSearchWrapper>
        <MembersStatisticsContainer>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Ник тг</TableHeader>
                <TableHeader>Ник</TableHeader>
                <TableHeader>Имя</TableHeader>
                <TableHeader>Фамилия</TableHeader>
                <TableHeader>Номер телефона</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Дата рождения</TableHeader>
                <TableHeader>Статус</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {filteredUsers &&
                filteredUsers.map((user, index) => (
                  <TableRow key={index} onClick={() => setSelectedUser(user)}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.date_of_birth}</TableCell>
                    <TableCell>
                      {user.status === true ? (
                        <StatusActive>В клубе</StatusActive>
                      ) : (
                        <StatusInactive>Не в клубе</StatusInactive>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </Table>
        </MembersStatisticsContainer>
      </StatisticsContainer>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </AdminContainer>
  );
}
