const pool = require('../db/config');
const socket = require('../socket');

exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const [messages] = await pool.query(`
      SELECT m.*, u.name as sender_name 
      FROM chat_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.room_id = ?
      ORDER BY m.created_at ASC
    `, [roomId]);
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const senderId = req.user.id;
    const { message } = req.body;

    // Check if user is authorized (owner or accepted member)
    const [room] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [roomId]);
    if (room.length === 0) return res.status(404).json({ message: 'Room not found' });
    
    const [members] = await pool.query("SELECT * FROM room_requests WHERE room_id = ? AND user_id = ? AND status = 'accepted'", [roomId, senderId]);
    
    if (room[0].owner_id !== senderId && members.length === 0) {
      return res.status(403).json({ message: 'You are not a member of this room' });
    }

    const [result] = await pool.query(
      'INSERT INTO chat_messages (room_id, sender_id, message) VALUES (?, ?, ?)',
      [roomId, senderId, message]
    );

    const [sender] = await pool.query("SELECT name FROM users WHERE id = ?", [senderId]);

    const newMessage = {
      id: result.insertId,
      room_id: roomId,
      sender_id: senderId,
      sender_name: sender[0].name,
      message,
      created_at: new Date()
    };

    const io = socket.getIo();
    io.to(`room_${roomId}`).emit('receive_message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};
