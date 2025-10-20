import Confession from "../models/Confession.js";

export const createConfession = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: "Text required" });
    const confession = new Confession({ text, user: req.user._id });
    await confession.save();
    res.status(201).json(confession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getConfessions = async (req, res) => {
  try {
    const confs = await Confession.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(); 

    const data = confs.map((c) => ({
      ...c,
      reactions: {
        love: c.reactions?.love || { count: 0, users: [] },
        laugh: c.reactions?.laugh || { count: 0, users: [] },
        sad: c.reactions?.sad || { count: 0, users: [] },
      },
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const react = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    if (!["love", "laugh", "sad"].includes(type))
      return res.status(400).json({ error: "Invalid reaction type" });

    const conf = await Confession.findById(id);
    if (!conf) return res.status(404).json({ error: "Confession not found" });

    const userReacted = conf.reactions[type].users.includes(userId);

    // --- UNREACT (Remove reaction)
    if (userReacted) {
      conf.reactions[type].users = conf.reactions[type].users.filter(uid => uid !== userId);
      conf.reactions[type].count = Math.max(0, conf.reactions[type].count - 1);
      await conf.save();
      return res.json({ message: `Removed ${type} reaction`, confession: conf });
    }

    // --- ADD REACTION
    conf.reactions[type].users.push(userId);
    conf.reactions[type].count += 1;

    await conf.save();
    res.json({ message: `Added ${type} reaction`, confession: conf });
  } catch (err) {
    console.error("Reaction error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const replyConfession = async (req, res) => {
  try {
    const { confessionId, text } = req.body;
    if (!confessionId || !text)
      return res.status(400).json({ error: "All fields required" });

    const confession = await Confession.findById(confessionId);
    if (!confession)
      return res.status(404).json({ error: "Confession not found" });

    confession.replies.push({ text, replierEmail: req.user.email });
    await confession.save();

    res.json({ message: "Reply added successfully!", replies: confession.replies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

