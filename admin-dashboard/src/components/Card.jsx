import { motion } from "framer-motion";

const Card = ({ title, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 rounded-xl shadow"
    >
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
};

export default Card;
