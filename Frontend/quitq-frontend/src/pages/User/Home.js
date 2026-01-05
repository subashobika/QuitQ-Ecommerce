import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaThLarge, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { getAllCategories } from '../../services/categoryService';

const categoryImages = {
  1: '/images/categories/electronics.jpg',
  2: '/images/categories/fashion.jpg',
  3: '/images/categories/home_kitchen.webp',
  4: '/images/categories/books.jpg',
  5: '/images/categories/beauty.jpg',
  6: '/images/categories/groceries.jpg',
};

const Home = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        setCategoriesError('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const featuredProducts = [
    { id: 1, name: 'Smartphone X10', image: 'https://m.media-amazon.com/images/I/81T3olLXpUL._SX679_.jpg', link: '/products/1' },
    { id: 2, name: 'Mens Casual Shirt', image: 'https://m.media-amazon.com/images/I/71YZfqHTe-L._SY879_.jpg', link: '/products/2' },
    { id: 3, name: 'Non-stick Cookware Set', image: 'https://m.media-amazon.com/images/I/517nDmj1i8L._SX679_.jpg', link: '/products/3' },
    { id: 4, name: 'The Great Gatsby', image: 'https://m.media-amazon.com/images/I/71qovngeOcL._SY466_.jpg', link: '/products/4' },
  ];

  const testimonials = [
    { id: 1, text: "Amazing deals and fast delivery!", author: "Alice W." },
    { id: 2, text: "QuitQ made my shopping effortless!", author: "Mark T." },
    { id: 3, text: "Best experience for sellers!", author: "Ella S." },
  ];

  const deals = [
    { id: 1, title: 'Leather Handbag', discount: '30% OFF', image: 'https://m.media-amazon.com/images/I/611akdMn+nL._AC_UL480_FMwebp_QL65_.jpg', link: '/products/10' },
    { id: 2, title: 'Denim Jeans', discount: '40% OFF', image: 'https://m.media-amazon.com/images/I/61N52ehr70L._SY879_.jpg', link: '/products/11' },
  ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 991, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const handleNewsletterSubmit = e => {
    e.preventDefault();
    if (email.trim() === '') {
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }
    setNewsletterMsg(`Thanks for subscribing, ${email}!`);
    setEmail('');
  };

  const [hoveredId, setHoveredId] = useState(null);
  const cardStyle = (id) => ({
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: hoveredId === id ? 'scale(1.05)' : 'scale(1)',
    boxShadow:
      hoveredId === id
        ? '0 8px 16px rgba(0,0,0,0.2)'
        : '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    height: '100%',
  });

  return (
    <>
      
      <section
        className="text-white text-center d-flex flex-column justify-content-center"
        style={{
          height: '400px',
          backgroundImage: "url('/images/background.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <h1 className="display-4 fw-bold">Welcome to QuitQ</h1>
          <p className="lead mb-4">Discover the best deals, tailored for you.</p>
          <Link to="/products" className="btn btn-lg btn-primary me-3">Shop Now</Link>
          <Link to="/about" className="btn btn-lg btn-outline-light">Learn More</Link>
        </div>
      </section>

      <div className="container mt-5">
        
        <section className="mb-5">
          <h2 className="mb-4 text-center">Shop by Category</h2>
          {loadingCategories ? (
            <p className="text-center">Loading categories...</p>
          ) : categoriesError ? (
            <p className="text-danger text-center">{categoriesError}</p>
          ) : (
            <div className="row">
              {categories.map(category => (
                <div key={category.id} className="col-md-4 mb-4">
                  <Link
                    to={`/categories/${category.id}`}
                    className="text-decoration-none"
                    onMouseEnter={() => setHoveredId(category.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="card" style={cardStyle(category.id)}>
                      <img
                        src={categoryImages[category.id] || 'https://via.placeholder.com/150?text=Category'}
                        alt={category.name}
                        style={{
                          objectFit: 'contain',
                          height: '120px',
                          width: '150px',
                          margin: '20px auto 10px',
                          display: 'block',
                        }}
                      />
                      <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title text-center">{category.name}</h5>
                        {category.description && (
                          <p className="card-text text-muted text-center">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        
        <section className="mb-5">
          <h2 className="mb-4 text-center">Top Deals</h2>
          <div className="row justify-content-center g-4">
            {deals.map(deal => (
              <div key={deal.id} className="col-10 col-sm-6 col-md-4 col-lg-3">
                <Link to={deal.link} className="text-decoration-none">
                  <div className="card shadow-sm h-100">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="card-img-top"
                      style={{ height: '140px', objectFit: 'contain', padding: '10px' }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{deal.title}</h5>
                      <span className="badge bg-danger">{deal.discount}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        
        {user ? (
          <>
            <h2>Hello{user.name ? `, ${user.name}` : ''}! Here's your quick access:</h2>
            <div className="row mt-3">
              {user.role === 'USER' && (
                <>
                  <ActionCard title="Browse Products" link="/products" color="info" />
                  <ActionCard title="Your Cart" link="/cart" color="success" />
                  <ActionCard title="Your Orders" link="/orders" color="warning" />
                </>
              )}
              {user.role === 'SELLER' && (
                <>
                  <ActionCard title="Seller Dashboard" link="/seller/dashboard" color="primary" />
                  <ActionCard title="Manage Products" link="/seller/products" color="dark" />
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <ActionCard title="Admin Dashboard" link="/admin/dashboard" color="danger" />
                  <ActionCard title="Manage Users" link="/admin/users" color="secondary" />
                </>
              )}
            </div>
          </>
        ) : (
          <p>Please <Link to="/login">login</Link> to access your dashboard.</p>
        )}

       
        <section className="my-5">
          <h2 className="mb-4">Featured Products</h2>
          <Slider {...carouselSettings}>
            {featuredProducts.map(product => (
              <Link key={product.id} to={product.link} className="text-decoration-none">
                <div
                  className="card mx-2 shadow-sm featured-product-card"
                  style={{ cursor: 'pointer', width: '220px' }}
                >
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="card-body p-2">
                    <h5 className="card-title text-center fs-5">{product.name}</h5>
                    <div className="text-center">
                      <span className="badge bg-danger fs-6">50% OFF</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </section>

        
        <section className="my-5 text-center">
          <h2 className="mb-4">What Our Customers Say</h2>
          <Slider {...testimonialSettings}>
            {testimonials.map(testimonial => (
              <blockquote key={testimonial.id} className="blockquote">
                <p className="mb-2 fs-5 fst-italic">"{testimonial.text}"</p>
                <footer className="blockquote-footer">{testimonial.author}</footer>
              </blockquote>
            ))}
          </Slider>
        </section>

        
        <section className="bg-light p-4 rounded-3 my-5 text-center">
          <h2 className="mb-3">Subscribe to Our Newsletter</h2>
          <form onSubmit={handleNewsletterSubmit} className="d-flex justify-content-center flex-wrap gap-2">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              style={{ maxWidth: '350px' }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-lg">
              Subscribe
            </button>
          </form>
          {newsletterMsg && <p className="mt-3 text-success">{newsletterMsg}</p>}
        </section>
      </div>

     
      <footer className="bg-dark text-white text-center p-4 mt-5">
        <div>© 2025 QuitQ. All rights reserved.</div>
        <div>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white mx-2">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white mx-2">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white mx-2">Instagram</a>
        </div>
      </footer>
    </>
  );
};

const ActionCard = ({ title, link, color }) => (
  <div className="col-md-4 mb-3">
    <Link to={link} className={`btn btn-lg btn-block btn-${color} text-white w-100`}>
      {title}
    </Link>
  </div>
);

export default Home;
