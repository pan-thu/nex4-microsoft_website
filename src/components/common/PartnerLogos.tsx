import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Data ──────────────────────────────────────────────────────────────────────

interface Logo { name: string; icon: string; }
interface Category { id: string; label: string; logos: Logo[]; }

const SI = 'https://cdn.jsdelivr.net/npm/simple-icons/icons';

const CATEGORIES: Category[] = [
  {
    id: 'partners',
    label: 'Partners',
    logos: [
      { name: 'Microsoft',  icon: 'microsoft'  },
      { name: 'Cisco',      icon: 'cisco'      },
      { name: 'Intel',      icon: 'intel'      },
      { name: 'Dell',       icon: 'dell'       },
      { name: 'IBM',        icon: 'ibm'        },
      { name: 'Oracle',     icon: 'oracle'     },
      { name: 'SAP',        icon: 'sap'        },
      { name: 'Lenovo',     icon: 'lenovo'     },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    logos: [
      { name: 'Palo Alto Networks', icon: 'paloaltonetworks' },
      { name: 'Fortinet',           icon: 'fortinet'         },
      { name: 'Qualys',             icon: 'qualys'           },
      { name: 'Okta',               icon: 'okta'             },
      { name: 'Datadog',            icon: 'datadog'          },
      { name: 'HashiCorp',          icon: 'hashicorp'        },
      { name: 'Snyk',               icon: 'snyk'             },
      { name: '1Password',          icon: '1password'        },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    logos: [
      { name: 'AWS',          icon: 'amazonaws'    },
      { name: 'Google Cloud', icon: 'googlecloud'  },
      { name: 'Salesforce',   icon: 'salesforce'   },
      { name: 'VMware',       icon: 'vmware'       },
      { name: 'Cloudflare',   icon: 'cloudflare'   },
      { name: 'DigitalOcean', icon: 'digitalocean' },
      { name: 'Heroku',       icon: 'heroku'       },
      { name: 'Netlify',      icon: 'netlify'      },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    logos: [
      { name: 'NetApp',     icon: 'netapp'     },
      { name: 'Veeam',      icon: 'veeam'      },
      { name: 'F5',         icon: 'f5'         },
      { name: 'Red Hat',    icon: 'redhat'     },
      { name: 'Docker',     icon: 'docker'     },
      { name: 'Kubernetes', icon: 'kubernetes' },
      { name: 'NGINX',      icon: 'nginx'      },
      { name: 'Ubuntu',     icon: 'ubuntu'     },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    logos: [
      { name: 'Samsung',      icon: 'samsung'      },
      { name: 'Sony',         icon: 'sony'         },
      { name: 'Grab',         icon: 'grab'         },
      { name: 'Shopee',       icon: 'shopee'       },
      { name: 'Rakuten',      icon: 'rakuten'      },
      { name: 'SoftBank',     icon: 'softbank'     },
      { name: 'LINE',         icon: 'line'         },
      { name: 'Panasonic',    icon: 'panasonic'    },
    ],
  },
  {
    id: 'consulting',
    label: 'Consulting',
    logos: [
      { name: 'Accenture',  icon: 'accenture'  },
      { name: 'Capgemini',  icon: 'capgemini'  },
      { name: 'Infosys',    icon: 'infosys'    },
      { name: 'Wipro',      icon: 'wipro'      },
      { name: 'Cognizant',  icon: 'cognizant'  },
    ],
  },
];

// ── Logo cell ─────────────────────────────────────────────────────────────────

function LogoCell({ logo, index }: { logo: Logo; index: number }) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  // hide cell entirely if logo failed — no text fallback
  if (state === 'error') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group w-[165px] h-[110px] flex items-center justify-center hover:bg-white/[0.03] transition-colors duration-200 cursor-default"
    >
      <img
        src={`${SI}/${logo.icon}.svg`}
        alt={logo.name}
        loading="lazy"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        style={{ filter: 'brightness(0) invert(1)' }}
        className={cn(
          'max-h-10 max-w-[110px] w-auto h-auto object-contain transition-opacity duration-300 group-hover:opacity-70',
          state === 'loaded' ? 'opacity-[0.32]' : 'opacity-0',
        )}
      />
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function PartnerLogos() {
  const [active, setActive] = useState<string>(CATEGORIES[0].id);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const current = CATEGORIES.find(c => c.id === active)!;

  return (
    <section className="border-t border-white/[0.05]">
      <div ref={ref} className="max-w-[1400px] mx-auto px-10 pt-14 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Heading */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/22 font-semibold mb-1.5">Ecosystem</p>
            <h2 className="text-[20px] font-semibold text-white">Partners &amp; Customers</h2>
          </div>

          {/* Tab bar — only this border-b serves as the separator */}
          <div className="overflow-x-auto -mx-10 px-10">
            <div className="flex items-end border-b border-white/[0.07] min-w-max">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  style={active === cat.id ? { borderBottomColor: '#060606' } : undefined}
                  className={cn(
                    'px-5 py-2.5 -mb-px text-[12px] font-medium tracking-[0.04em] transition-colors duration-150 border rounded-t-[3px] select-none',
                    active === cat.id
                      ? 'border-white/[0.07] bg-[#060606] text-white'
                      : 'border-transparent text-white/28 hover:text-white/55',
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logo area — flex-wrap, left-aligned, no cell borders */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap"
            >
              {current.logos.map((logo, i) => (
                <LogoCell key={`${active}-${logo.icon}`} logo={logo} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
