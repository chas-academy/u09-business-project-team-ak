const Footer = () => {
  return (
    <footer className="bg-[#121c14] text-white text-center py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-base mb-4">
        <div>
          <strong>About Us</strong>
          <br />
          We help people build healthy eating habits.
        </div>
        <div>
          <strong>Contact</strong>
          <br />
          support@healthyhabits.com
        </div>
        <div>
          <strong>Info</strong>
          <br />
          Recipes, tips, and planning tools.
        </div>
      </div>
      <p className="text-sm">© 2025 HealthyHabits</p>
    </footer>
  );
};

export default Footer;
