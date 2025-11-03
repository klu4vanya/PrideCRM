import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { Grid2 } from "@mui/material";
import { Calendar, MapPin, Users, Award, Clock } from "lucide-react";
import { StyledCard } from "./styles";
import big_stack from "../../assets/big stack.jpg";
import discipline from "../../assets/discipline.jpg";
import knokout from "../../assets/knokout.jpg";
import season from "../../assets/season.jpg";
import logo from "../../assets/logo_pride.jpeg";
import Menu from "../Menu";
import { Tournament } from "@/types";
import { API_BASE_URL, tournamentAPI } from "../../api";
import axios from "axios";
import { Navigate } from "react-router";

const TournamentCard = (tournament: Tournament) => {
  switch (tournament.description) {
    case "KNOCKOUT TOURNAMENT":
  }

  return (
    <StyledCard>
      <CardContent>
        <img
          // src={tournament.photo_id}
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {tournament.description}
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <Calendar size={18} style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            {tournament.date}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <MapPin size={18} style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            {tournament.location}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <Users size={18} style={{ marginRight: 8 }} />
          <Typography variant="body2" color="text.secondary">
            {tournament.participants}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <Award size={18} style={{ marginRight: 8 }} />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* <Chip label={tournament.game} color="primary" size="small" /> */}
          {tournament.status === "ended" ? (
            <Chip
              label="Tournament Ended"
              color="error"
              icon={<Clock size={16} />}
            />
          ) : tournament.status === "live" ? (
            <Button
              sx={{
                backgroundColor: "#16c098",
                color: "#fff",
              }}
              size="small"
              startIcon={<Clock size={16} />}
            >
              Идет
            </Button>
          ) : (
            <Button
              sx={{ backgroundColor: "#5932EA", color: "#fff" }}
              size="small"
            >
              Регистрация на игру
            </Button>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const TournamentSchedule = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState<string | null>(null);
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
    const fetchTournaments = async () => {
      if (!token) {
        setLoading(false);
        <Navigate to="/auth" />;
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}games/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setTournaments(response.data);
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
      fetchTournaments();
    }
  }, [token]); // Зависимость от token
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Menu />
      <Box sx={{ p: 3, maxWidth: 1300, margin: "0 auto" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Расписание игр
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Зарегистрироваться на игру можно через бота, сайт или написать админу
        </Typography>

        <Grid2 container spacing={2}>
          {tournaments &&
            tournaments.map((tournament, index) => (
              <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <TournamentCard {...tournament} />
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </>
  );
};

export default TournamentSchedule;
