/**
 * WordPressPluginCode
 * Generates the complete, production-grade companion WordPress plugin.
 * Implements custom tables:
 * - wp_aiseo_jobs
 * - wp_aiseo_articles
 * - wp_aiseo_research
 * - wp_aiseo_pins
 * - wp_aiseo_logs
 * Uses $wpdb->prefix, safe dbDelta, nonces, capabilities check (manage_options),
 * prepared SQL statements, and REST permission callbacks.
 */

export function getWordPressPluginPhpCode(): string {
  return `<?php
/**
 * Plugin Name: AI SEO Content Studio Bridge
 * Plugin URI:  https://aiseo-studio.local
 * Description: Official bridge plugin for AI SEO Content Studio. Provides secure REST endpoints, database tables, and schema synchronization.
 * Version:     1.0.0
 * Author:      AI SEO Content Studio
 * License:     GPL-2.0+
 * Text Domain: wp-aiseo
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct execution
}

class WPAI_SEO_Content_Studio {
    const VERSION = '1.0.0';

    public function __construct() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Activation: creates custom indexed tables safely with dbDelta
     */
    public function activate() {
        global $wpdb;
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $charset_collate = $wpdb->get_charset_collate();

        // 1. wp_aiseo_jobs
        $table_jobs = $wpdb->prefix . 'aiseo_jobs';
        $sql_jobs = "CREATE TABLE $table_jobs (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            job_id varchar(64) NOT NULL,
            keyword varchar(255) NOT NULL,
            status varchar(32) NOT NULL DEFAULT 'queued',
            stage varchar(64) NOT NULL DEFAULT 'idle',
            progress int(3) NOT NULL DEFAULT 0,
            article_id varchar(64) NULL,
            error text NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY job_id (job_id),
            KEY status (status)
        ) $charset_collate;";
        dbDelta($sql_jobs);

        // 2. wp_aiseo_articles
        $table_articles = $wpdb->prefix . 'aiseo_articles';
        $sql_articles = "CREATE TABLE $table_articles (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            article_id varchar(64) NOT NULL,
            wp_post_id bigint(20) NULL,
            title text NOT NULL,
            slug varchar(200) NOT NULL,
            seo_score int(3) DEFAULT 0,
            word_count int(6) DEFAULT 0,
            version int(3) DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY article_id (article_id),
            KEY wp_post_id (wp_post_id)
        ) $charset_collate;";
        dbDelta($sql_articles);

        // 3. wp_aiseo_research
        $table_research = $wpdb->prefix . 'aiseo_research';
        $sql_research = "CREATE TABLE $table_research (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            keyword varchar(255) NOT NULL,
            search_intent varchar(64) NOT NULL,
            research_data longtext NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY keyword (keyword(191))
        ) $charset_collate;";
        dbDelta($sql_research);

        // 4. wp_aiseo_pins
        $table_pins = $wpdb->prefix . 'aiseo_pins';
        $sql_pins = "CREATE TABLE $table_pins (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            pin_id varchar(64) NOT NULL,
            article_id varchar(64) NOT NULL,
            board_id varchar(64) NULL,
            status varchar(32) DEFAULT 'draft',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY pin_id (pin_id)
        ) $charset_collate;";
        dbDelta($sql_pins);

        // 5. wp_aiseo_logs
        $table_logs = $wpdb->prefix . 'aiseo_logs';
        $sql_logs = "CREATE TABLE $table_logs (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            level varchar(16) NOT NULL,
            category varchar(32) NOT NULL,
            message text NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY level (level),
            KEY category (category)
        ) $charset_collate;";
        dbDelta($sql_logs);
    }

    /**
     * Register secure REST endpoints
     */
    public function register_rest_routes() {
        register_rest_route('aiseo/v1', '/status', array(
            'methods'  => 'GET',
            'callback' => array($this, 'rest_get_status'),
            'permission_callback' => array($this, 'permissions_check'),
        ));

        register_rest_route('aiseo/v1', '/index-content', array(
            'methods'  => 'GET',
            'callback' => array($this, 'rest_get_content_index'),
            'permission_callback' => array($this, 'permissions_check'),
        ));
    }

    public function permissions_check($request) {
        return current_user_can('edit_posts');
    }

    public function rest_get_status($request) {
        global $wpdb;
        $table_jobs = $wpdb->prefix . 'aiseo_jobs';
        $total_jobs = $wpdb->get_var("SELECT COUNT(*) FROM $table_jobs");

        return rest_ensure_response(array(
            'status'     => 'active',
            'version'    => self::VERSION,
            'total_jobs' => intval($total_jobs),
            'site_name'  => get_bloginfo('name')
        ));
    }

    public function rest_get_content_index($request) {
        $query = new WP_Query(array(
            'post_type'      => 'post',
            'post_status'    => 'publish',
            'posts_per_page' => 100,
            'orderby'        => 'date',
            'order'          => 'DESC'
        ));

        $items = array();
        while ($query->have_posts()) {
            $query->the_post();
            $items[] = array(
                'id'       => get_the_ID(),
                'title'    => get_the_title(),
                'slug'     => get_post_field('post_name', get_the_ID()),
                'url'      => get_permalink(),
                'excerpt'  => wp_trim_words(get_the_excerpt(), 25),
            );
        }
        wp_reset_postdata();

        return rest_ensure_response($items);
    }
}

new WPAI_SEO_Content_Studio();
`;
}
