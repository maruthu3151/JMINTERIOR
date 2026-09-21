import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { getServices } from '../../services/servicesService';
import { ServiceItem } from '../../types';
import { Button } from '../../components/ui/Button';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getServices(true);
        setServices(data);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          What We Do
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-2">
          Tailored Interior & Carpentry Services
        </h1>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          From full residential architectural redesigns to individual modular kitchens and bespoke timber furnishings, our workshop provides end-to-end execution across Chennai.
        </p>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="space-y-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-stone-200 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {services.map((service, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Service Image */}
                  <div className={`relative min-h-[300px] lg:min-h-[420px] bg-stone-100 ${isReversed ? 'lg:col-start-2' : ''}`}>
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-wood-100 text-wood-600 font-serif text-xl">
                        {service.title}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="text-xs font-mono text-wood-700 font-bold tracking-wider">
                          0{idx + 1} // JM INTERIOR
                        </span>
                        {service.startingPrice && (
                          <span className="px-3 py-1 bg-wood-100 text-wood-900 text-xs font-semibold rounded-full">
                            Starting from {service.startingPrice}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                        {service.title}
                      </h2>

                      <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed whitespace-pre-line">
                        {service.description}
                      </p>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-stone-100">
                          <h4 className="text-xs uppercase font-bold tracking-wider text-stone-800 mb-3">
                            Key Specifications & Deliverables
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {service.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                                <CheckCircle2 className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center gap-4">
                      <Link to="/appointment">
                        <Button variant="primary" icon={<Calendar className="w-4 h-4 text-wood-300" />}>
                          Book This Service
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="outline">Inquire on WhatsApp / Call</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Commission CTA */}
      <div className="bg-wood-900 text-stone-100 p-8 sm:p-12 rounded-3xl text-center max-w-4xl mx-auto shadow-xl space-y-4">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold">
          Have a Custom Joinery or Architecture Requirement?
        </h3>
        <p className="text-stone-300 text-sm max-w-xl mx-auto">
          We fabricate custom teakwood temple units (Pooja rooms), heritage door carvings, fluted partitions, and bespoke commercial fixtures tailored precisely to your drawings.
        </p>
        <div className="pt-2">
          <Link to="/appointment">
            <Button variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
              Discuss Custom Commission
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
