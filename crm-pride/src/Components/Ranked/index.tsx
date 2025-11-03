import React from "react";
import {
  BoldPoints,
  CurrentPositionContainer,
  CurrentPositionTitle,
  LeaderBoardTitle,
  MyRankContainer,
  MyRankTitle,
  PointsContainer,
  RankedContainer,
  RankWrapper,
} from "./styles";
import Menu from "../Menu";
import { Trophy, Medal, Award, ChevronsUp, User } from "lucide-react";
import { Avatar, Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Player } from "@/types";

// TODO: диазйн, интеграция с таблицами


  const players: Player[] = [
    { rank: 1, name: "Alex Chen", score: 2847 },
    { rank: 2, name: "Sarah Johnson", score: 2792 },
    { rank: 3, name: "Mike Rodriguez", score: 2756 },
    { rank: 4, name: "Emily Zhang", score: 2698 },
    { rank: 5, name: "David Kim", score: 2645 },
    { rank: 6, name: "Lisa Wang", score: 2634 },
    { rank: 7, name: "You", score: 2598, isYou: true },
    { rank: 8, name: "Tom Wilson", score: 2567 },
    { rank: 9, name: "Jessica Brown", score: 2534 },
    { rank: 10, name: "Ryan Murphy", score: 2489 },
    { rank: 11, name: "Amanda Taylor", score: 2456 },
    { rank: 12, name: "Chris Anderson", score: 2423 },
  ];

export default function Ranked() {
  return (
    <RankedContainer>
    <Menu />
      <Box sx={{width: '70%', mx: "auto", p: 3 }}>
        {/* Заголовок */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Trophy size={32} color="#FFD700" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Рейтинг Pride
          </Typography>
        </Box>
        <Typography color="text.secondary" mb={4}>
         Данные подгружаются автоматически
        </Typography>

        {/* Ваш ранг */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: "#f5f5f5" }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Мой ранг
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`#${players.find((p) => p.isYou)?.rank}`}
              sx={{ fontSize: "1.2rem", p: 2, backgroundColor: "#5932EA", color: '#fff' }}
            />
            <Typography variant="h6" fontWeight="bold">
              Вы
            </Typography>
          </Box>
          <Typography color="text.secondary" mt={1}>
            Настоящая позиция
          </Typography>
        </Paper>

        {/* Таблица лидеров */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Топ игроки
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Место</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Игрок</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Очки
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow
                  key={player.rank}
                  sx={{
                    "&:last-child td": { border: 0 },
                    bgcolor: player.isYou ? "#e3f2fd" : "inherit",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {player.rank <= 3 && (
                        <Trophy
                          size={16}
                          color={
                            player.rank === 1
                              ? "#FFD700"
                              : player.rank === 2
                              ? "#C0C0C0"
                              : "#CD7F32"
                          }
                        />
                      )}
                      #{player.rank}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: player.isYou ? "#1976d2" : "#757575",
                        }}
                      >
                        <User size={16} color="#fff" />
                      </Avatar>
                      <Typography fontWeight={player.isYou ? "bold" : "normal"}>
                        {player.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">{player.score}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </RankedContainer>
  );
}
