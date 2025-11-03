import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  Chip,
  Stack,
  Grid2,
  Tooltip,
} from "@mui/material";
import {
  Award,
  Trophy,
  Coins,
  Flame,
  Calendar,
  Shield,
  QrCode,
  Crown,
  Medal,
} from "lucide-react";
import Menu from "../Menu";
import { Me, User } from "@/types";
import { API_BASE_URL } from "../../api";
import axios from "axios";
import { Navigate } from "react-router";

interface TournamentProfileData {
  name: string;
  nickname: string;
  photo?: string;
  rank: number;
  allPlayers: number;
  points: number;
  wins?: number;
}

const TournamentProfile = () => {
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
        const me = await axios.get(`${API_BASE_URL}me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setMe(me.data);
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

  // const isTop3 = (rank = 3);
  // const isTop2 = (rank = 2);
  // const isTop1 = (rank = 1);
  // const isTop27: boolean = rank <= 27;

  // const renderSwitch = () => {
  //   switch (rank) {
  //     default:
  //       return <Medal size={20} color="#4CAF50" />;
  //     case isTop1:
  //       return <Crown size={20} color="gold" style={{ marginRight: 4 }} />;
  //     case isTop2:
  //       return <Crown size={20} color="silver" style={{ marginRight: 4 }} />;
  //     case isTop3:
  //       return <Crown size={20} color="#cd7f32" />;
  //   }
  // };

  return (
    <>
      <Menu />
      <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
        {/* Header Section */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Привет, {me?.username}
        </Typography>

        {/* Profile Card */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              mb={2}
              justifyContent="space-between"
            >
              <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>ВК</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {me?.first_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {me?.username}{" "}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                {/* Rank #{rank}/ {allPlayers} */}
                {/* <Box component="span" sx={{ ml: 1, display: "inline-flex" }}>
                  {renderSwitch()}
                </Box> */}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <Box textAlign="center">
                  {/* <Typography variant="h4" fontWeight="bold">
                    {me?.rating}
                  </Typography> */}
                  <Typography variant="body2">Tournament Points</Typography>
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <QrCode size={48} />
                  <Typography variant="body2" mt={1}>
                    Authorization QR Code
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          Tournament Statistics
        </Typography>

        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Trophy size={32} style={{ marginBottom: 8 }} />
                {/* <Typography variant="h5">{wins}</Typography> */}
                <Typography variant="body2">Tournament Wins</Typography>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Coins size={32} style={{ marginBottom: 8 }} />
                <Typography variant="h5">$85K</Typography>
                <Typography variant="body2">Biggest Win</Typography>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Flame size={32} style={{ marginBottom: 8 }} />
                <Typography variant="h5">7</Typography>
                <Typography variant="body2">Current Streak</Typography>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Calendar size={32} style={{ marginBottom: 8 }} />
                <Typography variant="h5">Jan 2023</Typography>
                <Typography variant="body2">Member Since</Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

export default TournamentProfile;
