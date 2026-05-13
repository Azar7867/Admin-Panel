const Employee = require("../models/Employee");
const User = require("../models/User");

exports.createEmployee = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const emp = await Employee.create(req.body);
  res.json(emp);
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    const user = await User.findById(req.user.id);

    if (req.user.role === "admin" || user.fullAccess) {
      const fullData = employees.map((emp) => ({
        ...emp._doc,
        fullAccess: true,
      }));

      return res.json(fullData);
    }

    const limitedData = employees.map((emp) => ({
      _id: emp._id,
      name: emp.name,
      email: emp.email,
      department: emp.department,

      salary: "Restricted",
      performanceRating: "Restricted",

      fullAccess: false,
    }));

    res.json(limitedData);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.grantAccess = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { fullAccess: true },
    { new: true },
  );

  res.json(user);
};
exports.removeAccess = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullAccess: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Access removed successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.grantPageAccess = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin only",
      });
    }

    const { page } = req.body;

    const user = await User.findById(req.params.id);

    if (!user.permissions.includes(page)) {
      user.permissions.push(page);
    }

    await user.save();

    res.json({
      success: true,
      permissions: user.permissions,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.removePageAccess = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin only",
      });
    }

    const { page } = req.body;

    const user = await User.findById(req.params.id);

    user.permissions = user.permissions.filter((p) => p !== page);

    await user.save();

    res.json({
      success: true,
      permissions: user.permissions,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
