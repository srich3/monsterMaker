const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get user profile
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's monsters
app.get('/api/monsters', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('monsters')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single monster
app.get('/api/monsters/:id', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('monsters')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Monster not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create monster
app.post('/api/monsters', authenticateUser, async (req, res) => {
  try {
    // Only include fields that exist in the database schema
    const allowedFields = [
      'name', 'level', 'size', 'rarity', 'hp', 'ac', 'perception', 
      'fortitude', 'reflex', 'will', 'description', 'private_notes', 
      'image_url', 'skills', 'attacks', 'items', 'spells',
      // New fields from migration (if they exist)
      'road_map', 'strength', 'dexterity', 'constitution', 
      'intelligence', 'wisdom', 'charisma', 'speed'
    ];
    
    const filteredData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        filteredData[field] = req.body[field];
      }
    });
    
    const monsterData = {
      ...filteredData,
      user_id: req.user.id,
      created_at: new Date().toISOString()
    };

    console.log('Filtered monster data:', monsterData);

    const { data, error } = await supabase
      .from('monsters')
      .insert([monsterData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating monster:', error);
    console.error('Request body:', req.body);
    console.error('Error details:', error.details || error.hint || error.code);
    res.status(500).json({ error: error.message });
  }
});

// Update monster
app.put('/api/monsters/:id', authenticateUser, async (req, res) => {
  try {
    // Only include fields that exist in the database schema
    const allowedFields = [
      'name', 'level', 'size', 'rarity', 'hp', 'ac', 'perception', 
      'fortitude', 'reflex', 'will', 'description', 'private_notes', 
      'image_url', 'skills', 'attacks', 'items', 'spells',
      // New fields from migration (if they exist)
      'road_map', 'strength', 'dexterity', 'constitution', 
      'intelligence', 'wisdom', 'charisma', 'speed'
    ];
    
    const filteredData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        filteredData[field] = req.body[field];
      }
    });
    
    const updateData = {
      ...filteredData,
      updated_at: new Date().toISOString()
    };

    console.log('Filtered update data:', updateData);

    const { data, error } = await supabase
      .from('monsters')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Monster not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating monster:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete monster
app.delete('/api/monsters/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('monsters')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate FoundryVTT compatible IDs
const generateFoundryId = () => {
  return Math.random().toString(36).substring(2, 18);
};

// Helper function to convert attacks to FoundryVTT format
const convertAttacksToFoundryVTT = (attacks) => {
  if (!Array.isArray(attacks)) return [];
  
  return attacks.map((attack, index) => ({
    _id: generateFoundryId(),
    img: "systems/pf2e/icons/default-icons/melee.svg",
    name: attack.name || "Attack",
    sort: (index + 1) * 100000,
    system: {
      attackEffects: {
        value: []
      },
      bonus: {
        value: attack.bonus || 0
      },
      damageRolls: {
        [generateFoundryId()]: {
          damage: attack.damage || "1d4",
          damageType: attack.damageType || "bludgeoning",
          category: null
        }
      },
      description: {
        value: attack.description || "",
        gm: ""
      },
      publication: {
        license: "OGL",
        remaster: false,
        title: "",
        authors: ""
      },
      rules: [],
      slug: null,
      traits: {
        value: attack.traits || [],
        otherTags: []
      },
      _migration: {
        version: 0.94,
        previous: null
      }
    },
    type: attack.type || "melee",
    _stats: {
      coreVersion: "13.345",
      systemId: "pf2e",
      systemVersion: "7.2.1",
      lastModifiedBy: null
    },
    effects: [],
    folder: null,
    flags: {}
  }));
};

// Helper function to convert skills to FoundryVTT format
const convertSkillsToFoundryVTT = (skills) => {
  if (!skills || typeof skills !== 'object') return {};
  
  const convertedSkills = {};
  Object.entries(skills).forEach(([skillName, skillData]) => {
    convertedSkills[skillName.toLowerCase()] = {
      base: skillData.bonus || skillData.value || 0
    };
  });
  
  return convertedSkills;
};

// Export monster for FoundryVTT
app.get('/api/monsters/:id/export', authenticateUser, async (req, res) => {
  try {
    const { data: monster, error } = await supabase
      .from('monsters')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!monster) {
      return res.status(404).json({ error: 'Monster not found' });
    }

    // Convert to FoundryVTT PF2e format - simplified to match example
    const foundryData = {
      folder: null,
      img: monster.image_url || "systems/pf2e/icons/default-icons/npc.svg",
      items: convertAttacksToFoundryVTT(monster.attacks),
      name: monster.name,
      system: {
        attributes: {
          hp: {
            value: monster.hp || 10,
            temp: 0,
            max: monster.hp || 10,
            details: ""
          },
          speed: {
            value: monster.speed || 25,
            otherSpeeds: [],
            details: ""
          },
          ac: {
            value: monster.ac || 15,
            details: ""
          },
          allSaves: {
            value: ""
          }
        },
        initiative: {
          statistic: "perception"
        },
        details: {
          languages: {
            value: [],
            details: ""
          },
          level: {
            value: monster.level || 1
          },
          blurb: "",
          publicNotes: monster.description || "",
          privateNotes: monster.private_notes || "",
          publication: {
            title: "Monster Maker",
            authors: "",
            license: "OGL",
            remaster: false
          }
        },
        resources: {},
        _migration: {
          version: 0.94,
          previous: null
        },
        abilities: {
          str: {
            mod: Math.floor(((monster.strength || 10) - 10) / 2)
          },
          dex: {
            mod: Math.floor(((monster.dexterity || 10) - 10) / 2)
          },
          con: {
            mod: Math.floor(((monster.constitution || 10) - 10) / 2)
          },
          int: {
            mod: Math.floor(((monster.intelligence || 10) - 10) / 2)
          },
          wis: {
            mod: Math.floor(((monster.wisdom || 10) - 10) / 2)
          },
          cha: {
            mod: Math.floor(((monster.charisma || 10) - 10) / 2)
          }
        },
        perception: {
          details: "",
          mod: monster.perception || 0,
          senses: [],
          vision: true
        },
        saves: {
          fortitude: {
            value: monster.fortitude || 0,
            saveDetail: ""
          },
          reflex: {
            value: monster.reflex || 0,
            saveDetail: ""
          },
          will: {
            value: monster.will || 0,
            saveDetail: ""
          }
        },
        skills: convertSkillsToFoundryVTT(monster.skills),
        traits: {
          value: [],
          rarity: monster.rarity || "common",
          size: {
            value: monster.size || "medium"
          }
        }
      },
      type: "npc",
      _stats: {
        coreVersion: "13.345",
        systemId: "pf2e",
        systemVersion: "7.2.1",
        createdTime: Date.now(),
        modifiedTime: Date.now(),
        lastModifiedBy: null
      },
      effects: [],
      prototypeToken: {
        name: monster.name,
        displayName: 0,
        actorLink: false,
        width: 1,
        height: 1,
        texture: {
          src: monster.image_url || "systems/pf2e/icons/default-icons/npc.svg",
          anchorX: 0.5,
          anchorY: 0.5,
          offsetX: 0,
          offsetY: 0,
          fit: "contain",
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          tint: "#ffffff",
          alphaThreshold: 0.75
        },
        lockRotation: false,
        rotation: 0,
        alpha: 1,
        disposition: -1,
        displayBars: 0,
        bar1: {
          attribute: "attributes.hp"
        },
        bar2: {
          attribute: null
        },
        light: {
          negative: false,
          priority: 0,
          alpha: 0.5,
          angle: 360,
          bright: 0,
          color: null,
          coloration: 1,
          dim: 0,
          attenuation: 0.5,
          luminosity: 0.5,
          saturation: 0,
          contrast: 0,
          shadows: 0,
          animation: {
            type: null,
            speed: 5,
            intensity: 5,
            reverse: false
          },
          darkness: {
            min: 0,
            max: 1
          }
        },
        sight: {
          enabled: false,
          range: 0,
          angle: 360,
          visionMode: "basic",
          color: null,
          attenuation: 0.1,
          brightness: 0,
          saturation: 0,
          contrast: 0
        },
        detectionModes: [],
        occludable: {
          radius: 0
        },
        ring: {
          enabled: false,
          colors: {
            ring: null,
            background: null
          },
          effects: 1,
          subject: {
            scale: 1,
            texture: null
          }
        },
        turnMarker: {
          mode: 1,
          animation: null,
          src: null,
          disposition: false
        },
        movementAction: null,
        flags: {
          pf2e: {
            linkToActorSize: true,
            autoscale: true
          }
        },
        randomImg: false,
        appendNumber: false,
        prependAdjective: false
      },
      flags: {
        "monster-maker": {
          exported: true,
          exportDate: new Date().toISOString(),
          roadMap: monster.road_map || null
        }
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${monster.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json"`);
    res.json(foundryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 